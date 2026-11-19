namespace Qubriq.Api.Auth;

public static class AuthorizationPolicies
{
    public const string RequireAdmin = "RequireAdmin";
    public const string RequireOperations = "RequireOperations";
    public const string RequireBookingCustomer = "RequireBookingCustomer";
    public const string RequireShipmentRecipient = "RequireShipmentRecipient";
    public const string RequireAnyRole = "RequireAnyRole";
}
