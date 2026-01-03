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

        public async Task<List<VoucherDto>> GetAllAsync(string? userId)
        {
            var query = _context.Vouchers.AsQueryable();
            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(v => v.UserId == userId);
            }
            var vouchers = await VoucherQuery(query).ToListAsync();
            return vouchers;
        }

        public async Task<VoucherDto> GetVoucherAsync(int? id, string? userId)
        {
            var query = _context.Vouchers.AsQueryable();
            if (!string.IsNullOrEmpty(userId))
            {   
                query = query.Where(v => v.Id == id && v.UserId == userId);
            }
            var voucher = await VoucherQuery(query).Where(v => v.Id == id).SingleOrDefaultAsync();
            if (voucher == null)
            {
                return new VoucherDto()
                {
                    Error = "Voucher Not found"
                };
            }
            return voucher;
        }

        public async Task<Voucher> AddAsync(VoucherDto voucher, string userId)
        {
             var result = new Voucher()
                {
                    UserId = userId,
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
        public async Task<VoucherDto> EditAsync(VoucherDto voucher, int? id, string? userId)
        {
            Voucher? voucherToEdit = await _context.Vouchers.Include(o => o.Orders).FirstOrDefaultAsync(x => x.Id == id && (string.IsNullOrEmpty(userId) || x.UserId == userId));
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
        private IQueryable<VoucherDto> VoucherQuery(IQueryable<Voucher> query)
        {
            return query.Select(v => new VoucherDto
            {
                Id = v.Id,
                Customer = v.Customer,
                Date = v.Date,
                UserName = v.User.UserName,
                Orders = v.Orders.Select(o => new OrderDto
                {
                    Item = o.Item,
                    Price = o.Price,
                    Quantity = o.Quantity
                }).ToList()
            }).AsNoTracking();
        }
    }
}
