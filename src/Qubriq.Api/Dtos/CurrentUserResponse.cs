namespace Qubriq.Api.Dtos;

public sealed record CurrentUserResponse(string Id, string FullName, string Email, string Role);
