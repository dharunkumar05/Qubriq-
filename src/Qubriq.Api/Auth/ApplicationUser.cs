using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Qubriq.Api.Auth;

public sealed class ApplicationUser : IdentityUser
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
}
