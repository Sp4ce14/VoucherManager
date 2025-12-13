using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace VoucherManager.Dtos
{
    public class SignUpDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
