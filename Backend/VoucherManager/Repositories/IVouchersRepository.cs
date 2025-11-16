using Microsoft.AspNetCore.Mvc;
using VoucherManager.Dtos;
using VoucherManager.Models;

namespace VoucherManager.Repositories
{
    public interface IVouchersRepository
    {
        Task<List<VoucherDto>> GetAllAsync();
        Task<VoucherDto> GetVoucherAsync(int? id);
        Task<Voucher> AddAsync(VoucherDto voucher);
        Task<VoucherDto> EditAsync(VoucherDto voucher, int? id);
        Task<VoucherDto> DeleteAsync(int? id);
    }
}
