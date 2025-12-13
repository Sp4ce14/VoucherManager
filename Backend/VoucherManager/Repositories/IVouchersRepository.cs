using Microsoft.AspNetCore.Mvc;
using VoucherManager.Dtos;
using VoucherManager.Models;

namespace VoucherManager.Repositories
{
    public interface IVouchersRepository
    {
        Task<List<VoucherDto>> GetAllAsync(string? userId);
        Task<VoucherDto> GetVoucherAsync(int? id, string? userId);
        Task<Voucher> AddAsync(VoucherDto voucher, string userId);
        Task<VoucherDto> EditAsync(VoucherDto voucher, int? id, string? userId);
        Task<VoucherDto> DeleteAsync(int? id);
    }
}
