using System;
using System.Collections.Generic;

namespace VoucherManager.Models;

public partial class Order
{
    public int Id { get; set; }

    public int VoucherId { get; set; }

    public string Item { get; set; } = null!;

    public int Price { get; set; }

    public int Quantity { get; set; }

    public virtual Voucher Voucher { get; set; } = null!;
}
