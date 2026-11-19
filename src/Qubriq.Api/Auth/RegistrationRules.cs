namespace Qubriq.Api.Auth;

public static class RegistrationRules
{
    public static bool IsRoleAllowed(string role, bool allowPrivileged)
    {
        if (role == AppRoles.BookingCustomer || role == AppRoles.ShipmentRecipient)
        {
            return true;
        }

        if (allowPrivileged &&
            (role == AppRoles.Admin || role == AppRoles.Operations))
        {
            return true;
        }

        return false;
    }
}
