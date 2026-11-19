using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Qubriq.Api.Data;

namespace Qubriq.Api.Auth;

public static class IdentitySeeder
{
    public static async Task SeedAsync(
        IServiceProvider services,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        ILogger logger)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        if (environment.IsDevelopment())
        {
            await db.Database.MigrateAsync();
        }

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var roleName in new[] { AppRoles.Admin, AppRoles.Operations, AppRoles.BookingCustomer, AppRoles.ShipmentRecipient })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        if (!environment.IsDevelopment())
        {
            return;
        }

        var section = configuration.GetSection("Seed:Admin");
        var email = section["Email"];
        var fullName = section["FullName"];
        var password = section["Password"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        if (await userManager.FindByEmailAsync(email) is not null)
        {
            return;
        }
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = fullName,
            EmailConfirmed = true
        };
        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException("Failed to seed the development admin: " +
                string.Join("; ", result.Errors.Select(error => error.Description)));
        }
        await userManager.AddToRoleAsync(user, AppRoles.Admin);
        logger.LogInformation("Seeded the development admin user.");
    }
}
