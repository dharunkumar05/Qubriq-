using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using Qubriq.Api.Auth;
using Qubriq.Api.Data;
using Qubriq.Api.Dtos;
using Qubriq.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is not configured.");
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 36)));
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
    CookieAuthConfiguration.Configure(options));

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationPolicies.RequireAdmin,
        policy => policy.RequireRole(AppRoles.Admin));
    options.AddPolicy(AuthorizationPolicies.RequireOperations,
        policy => policy.RequireRole(AppRoles.Operations));
    options.AddPolicy(AuthorizationPolicies.RequireBookingCustomer,
        policy => policy.RequireRole(AppRoles.BookingCustomer));
    options.AddPolicy(AuthorizationPolicies.RequireShipmentRecipient,
        policy => policy.RequireRole(AppRoles.ShipmentRecipient));
    options.AddPolicy(AuthorizationPolicies.RequireAnyRole,
        policy => policy.RequireRole(
            AppRoles.Admin,
            AppRoles.Operations,
            AppRoles.BookingCustomer,
            AppRoles.ShipmentRecipient));
});


builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "qubriq.csrf";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});


builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("register", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.AddPolicy("login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new ErrorResponse("Too many attempts. Try again later."),
            cancellationToken);
    };
});

var app = builder.Build();

await IdentitySeeder.SeedAsync(
    app.Services,
    app.Configuration,
    app.Environment,
    app.Logger);

app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

app.MapAuthEndpoints();

app.Run();
