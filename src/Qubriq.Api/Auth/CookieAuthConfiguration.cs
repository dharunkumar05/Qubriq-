using Microsoft.AspNetCore.Authentication.Cookies;
using Qubriq.Api.Dtos;

namespace Qubriq.Api.Auth;

public static class CookieAuthConfiguration
{
    public static CookieAuthenticationOptions Configure(CookieAuthenticationOptions options)
    {
        options.Cookie.Name = "qubriq.auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsJsonAsync(new ErrorResponse("Authentication required."));
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsJsonAsync(new ErrorResponse("Forbidden."));
        };
        return options;
    }
}
