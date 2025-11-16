using Microsoft.EntityFrameworkCore;
using VoucherManager.Data;
using VoucherManager.Dtos;
using VoucherManager.Models;

namespace VoucherManager.Repositories
{
    public class VouchersRepository : IVouchersRepository
    {
        private readonly AppDbContext _context;

        public VouchersRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<VoucherDto>> GetAllAsync()
        {
            List<VoucherDto> vouchers = await _context.Vouchers.Select(v => new VoucherDto()
            {
                Customer = v.Customer,
                Date = v.Date,
                Orders = v.Orders.Select(o => new OrderDto()
                {
                    Item = o.Item,
                    Price = o.Price,
                    Quantity = o.Quantity
                }).ToList()
            }).ToListAsync();
            return vouchers;
        }

        public async Task<VoucherDto> GetVoucherAsync(int? id)
        {
            VoucherDto? voucher = await _context.Vouchers.Where(v => v.Id == id).Select(v => new VoucherDto()
            {
                Customer = v.Customer,
                Date = v.Date,
                Orders = v.Orders.Select(o => new OrderDto()
                {
                    Item = o.Item,
                    Price = o.Price,
                    Quantity = o.Quantity
                }).ToList()
            }).FirstOrDefaultAsync();
            if (voucher == null)
            {
                return new VoucherDto()
                {
                    Error = "Voucher Not found"
                };
            }
            return voucher;
        }

        public async Task<Voucher> AddAsync(VoucherDto voucher)
        {
            var result = new Voucher()
            {
                Customer = voucher.Customer,
                Date = voucher.Date,
                Orders = voucher.Orders.Select(o => new Order()
                {
                    Price = o.Price,
                    Quantity = o.Quantity,
                    Item = o.Item
                }).ToList()

            };
            await _context.AddAsync(result);
            await _context.SaveChangesAsync();
            return result;
        }
        public async Task<VoucherDto> EditAsync(VoucherDto voucher, int? id)
        {
            var voucherToEdit = await _context.Vouchers.Include(o => o.Orders).FirstOrDefaultAsync(x => x.Id == id);
            if (voucherToEdit == null)
            {
                return new VoucherDto()
                {
                    Error = "Voucher not found"
                };
            }
            voucherToEdit.Customer = voucher.Customer;
            voucherToEdit.Date = voucher.Date;
            voucherToEdit.Orders.Clear();
            foreach (var order in voucher.Orders)
            {
                voucherToEdit.Orders.Add(new Order()
                {
                    Price = order.Price,
                    Quantity = order.Quantity,
                    Item = order.Item
                });
            }
            await _context.SaveChangesAsync();
            return voucher;
        }
        
        public async Task<VoucherDto> DeleteAsync(int? id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null)
            {
                return new VoucherDto()
                {
                    Error = "Voucher not found"
                };
            }
            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
            return new VoucherDto()
            {
                Error = null
            };
        }
    }
}
