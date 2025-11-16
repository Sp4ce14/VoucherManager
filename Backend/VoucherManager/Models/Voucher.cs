using System;
using System.Collections.Generic;

namespace VoucherManager.Models;

public partial class Voucher
{
    public int Id { get; set; }

    public string Customer { get; set; } = null!;

    public DateTime Date { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
