using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Qubriq.Api.Auth;
using Qubriq.Api.Dtos;
using Qubriq.Api.Security;

namespace Qubriq.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var auth = endpoints.MapGroup("/api/auth");

        auth.MapGet("/csrf", (IAntiforgery antiforgery, HttpContext context) =>
        {
            var tokens = antiforgery.GetAndStoreTokens(context);
            return Results.Ok(new CsrfResponse(tokens.RequestToken ?? string.Empty));
        }).AllowAnonymous();

        auth.MapPost("/register", async (
            HttpContext context,
            IConfiguration configuration,
            ILoggerFactory loggerFactory,
            UserManager<ApplicationUser> userManager) =>
        {
            if (!await context.ValidateCsrfAsync())
            {
                return Results.BadRequest(new ErrorResponse("Invalid or missing security token."));
            }

            RegisterRequest? request;
            try
            {
                using var document = await JsonDocument.ParseAsync(context.Request.Body);
                var root = document.RootElement;
                request = new RegisterRequest(
                    GetJsonString(root, "fullName"),
                    GetJsonString(root, "email"),
                    GetJsonString(root, "phone"),
                    GetJsonString(root, "password"),
                    GetJsonString(root, "confirmPassword"),
                    GetJsonString(root, "role"),
                    GetJsonBoolean(root, "acceptTerms"));
            }
            catch (JsonException)
            {
                return Results.BadRequest(new ErrorResponse("The request body is invalid."));
            }

            if (request is null)
            {
                return Results.BadRequest(new ErrorResponse("The request body is invalid."));
            }

            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(request, new ValidationContext(request), validationResults, true))
            {
                return Results.BadRequest(new ErrorResponse(validationResults[0].ErrorMessage ?? "Validation failed."));
            }

            if (!request.AcceptTerms)
            {
                return Results.BadRequest(new ErrorResponse("You must accept the terms."));
            }
            if (request.Password != request.ConfirmPassword)
            {
                return Results.BadRequest(new ErrorResponse("Passwords do not match."));
            }

            var allowPrivileged = configuration.GetValue<bool>("Registration:AllowPrivilegedRoles");
            if (!RegistrationRules.IsRoleAllowed(request.Role, allowPrivileged))
            {
                return Results.Json(
                    new ErrorResponse("This role cannot be registered publicly."),
                    statusCode: StatusCodes.Status403Forbidden);
            }

            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            if (await userManager.FindByEmailAsync(normalizedEmail) is not null)
            {
                return Results.Json(
                    new ErrorResponse("An account with this email already exists."),
                    statusCode: StatusCodes.Status409Conflict);
            }

            var user = new ApplicationUser
            {
                UserName = normalizedEmail,
                Email = normalizedEmail,
                PhoneNumber = request.Phone,
                FullName = request.FullName,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                var message = string.Join(" ", createResult.Errors.Select(error => error.Description));
                return Results.BadRequest(new ErrorResponse(message));
            }

            var roleResult = await userManager.AddToRoleAsync(user, request.Role);
            if (!roleResult.Succeeded)
            {
                await userManager.DeleteAsync(user);
                return Results.Json(
                    new ErrorResponse("Account could not be created. Please try again."),
                    statusCode: StatusCodes.Status500InternalServerError);
            }

            loggerFactory.CreateLogger("AuthEndpoints")
                .LogInformation("User {UserId} registered with role {Role}", user.Id, request.Role);

            return Results.Created(
                $"/api/auth/register/{user.Id}",
                new RegisterResponse(user.Id, user.FullName, user.Email, request.Role));
        }).AllowAnonymous().RequireRateLimiting("register").DisableAntiforgery();

        auth.MapPost("/login", async (
            HttpContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager) =>
        {
            if (!await context.ValidateCsrfAsync())
            {
                return Results.BadRequest(new ErrorResponse("Invalid or missing security token."));
            }
            var request = await context.Request.ReadFromJsonAsync<LoginRequest>();
            if (request is null)
            {
                return Results.BadRequest(new ErrorResponse("The request body is invalid."));
            }
            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(request, new ValidationContext(request), validationResults, true))
            {
                return Results.BadRequest(new ErrorResponse(validationResults[0].ErrorMessage ?? "Validation failed."));
            }

            var user = await userManager.FindByEmailAsync(request.Identifier);
            if (user is null)
            {
                user = await userManager.FindByNameAsync(request.Identifier);
            }
            if (user is null)
            {
                return Results.Json(new ErrorResponse("Invalid email/username or password."),
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            var signIn = await signInManager.PasswordSignInAsync(
                user, request.Password, request.RememberMe, lockoutOnFailure: true);
            if (signIn.IsLockedOut)
            {
                return Results.Json(new ErrorResponse("This account is locked. Try again later."),
                    statusCode: StatusCodes.Status423Locked);
            }
            if (!signIn.Succeeded)
            {
                return Results.Json(new ErrorResponse("Invalid email/username or password."),
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            var roles = await userManager.GetRolesAsync(user);
            if (roles.Count != 1)
            {
                await signInManager.SignOutAsync();
                return Results.Json(new ErrorResponse("This account does not have a valid role."),
                    statusCode: StatusCodes.Status403Forbidden);
            }
            return Results.Ok(new LoginResponse(user.Id, user.FullName, user.Email ?? string.Empty, roles[0]));
        }).AllowAnonymous().RequireRateLimiting("login").DisableAntiforgery();

        auth.MapPost("/logout", async (
            HttpContext context,
            SignInManager<ApplicationUser> signInManager) =>
        {
            if (!await context.ValidateCsrfAsync())
            {
                return Results.BadRequest(new ErrorResponse("Invalid or missing security token."));
            }
            await signInManager.SignOutAsync();
            return Results.NoContent();
        }).RequireAuthorization().DisableAntiforgery();

        auth.MapGet("/me", async (
            ClaimsPrincipal principal,
            UserManager<ApplicationUser> userManager) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }
            var user = await userManager.FindByIdAsync(userId);
            if (user is null)
            {
                return Results.Unauthorized();
            }
            var roles = await userManager.GetRolesAsync(user);
            if (roles.Count != 1)
            {
                return Results.Json(new ErrorResponse("This account does not have a valid role."),
                    statusCode: StatusCodes.Status403Forbidden);
            }
            return Results.Ok(new CurrentUserResponse(
                user.Id, user.FullName, user.Email ?? string.Empty, roles[0]));
        }).RequireAuthorization();

        return endpoints;
    }

    private static string GetJsonString(JsonElement root, string propertyName)
    {
        if (root.ValueKind != JsonValueKind.Object)
        {
            return string.Empty;
        }

        foreach (var property in root.EnumerateObject())
        {
            if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase))
            {
                return property.Value.ValueKind == JsonValueKind.String
                    ? property.Value.GetString() ?? string.Empty
                    : string.Empty;
            }
        }

        return string.Empty;
    }

    private static bool GetJsonBoolean(JsonElement root, string propertyName)
    {
        if (root.ValueKind != JsonValueKind.Object)
        {
            return false;
        }

        foreach (var property in root.EnumerateObject())
        {
            if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase))
            {
                return property.Value.ValueKind == JsonValueKind.True;
            }
        }

        return false;
    }
}
