using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoucherManager.Models;

public partial class Voucher
{
    public int Id { get; set; }

    public string Customer { get; set; } = null!;

    public DateTime Date { get; set; }
    public string? UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public IdentityUser? User { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
