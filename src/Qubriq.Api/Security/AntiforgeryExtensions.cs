using Microsoft.AspNetCore.Antiforgery;

namespace Qubriq.Api.Security;

public static class AntiforgeryExtensions
{
    public static async Task<bool> ValidateCsrfAsync(this HttpContext context)
    {
        try
        {
            var antiforgery = context.RequestServices.GetRequiredService<IAntiforgery>();
            await antiforgery.ValidateRequestAsync(context);
            return true;
        }
        catch (AntiforgeryValidationException)
        {
            return false;
        }
        catch (InvalidOperationException)
        {
            return false;
        }
    }
}
