using System.ComponentModel.DataAnnotations;

namespace Qubriq.Api.Dtos;

public sealed record RegisterRequest(
    [property: Required][property: MaxLength(150)] string FullName,
    [property: Required][property: EmailAddress][property: MaxLength(256)] string Email,
    [property: Required][property: RegularExpression(@"^(?:[0-9]{7,20}|\+[0-9]{7,19})$")] string Phone,
    [property: Required][property: MaxLength(256)] string Password,
    [property: Required] string ConfirmPassword,
    [property: Required] string Role,
    bool AcceptTerms);
