using System.ComponentModel.DataAnnotations;

namespace Qubriq.Api.Dtos;

public sealed record LoginRequest(
    [property: Required][property: MaxLength(256)] string Identifier,
    [property: Required][property: MaxLength(256)] string Password,
    bool RememberMe);
