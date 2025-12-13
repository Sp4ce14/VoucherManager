using System.ComponentModel.DataAnnotations;

namespace VoucherManager.Dtos
{
    public class RefreshReqDto
    {
        [Required]
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
    }
}
