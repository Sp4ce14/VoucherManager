using System.ComponentModel.DataAnnotations;
using VoucherManager.Models;

namespace VoucherManager.Dtos
{
    public class VoucherDto
    {
        public int Id { get; set; }
        [Required]
        public string? Customer { get; set; }
        [Required]
        public  DateTime Date { get; set; }
        public string? UserName { get; set; }

        public ICollection<OrderDto>? Orders { get; set; }
        public string? Error { get; set; }
    }
}
