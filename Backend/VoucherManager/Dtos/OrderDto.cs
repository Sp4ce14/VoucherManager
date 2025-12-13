using System.ComponentModel.DataAnnotations;

namespace VoucherManager.Dtos
{
    public class OrderDto
    {
        [Required]
        public string? Item { get; set; }

        [Required]
        public int Price { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
