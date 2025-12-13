using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoucherManager.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public string? Token { get; set; }
        public string JwtId { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTimeOffset DateAdded { get; set; }
        public DateTimeOffset DateExpire { get; set; }
        [ForeignKey(nameof(UserId))]
        public IdentityUser? User { get; set; }
    }
}
