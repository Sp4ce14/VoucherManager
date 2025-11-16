using Microsoft.AspNetCore.Identity;
using VoucherManager.Dtos;

namespace VoucherManager.Repositories
{
    public interface IAccountsRepository
    {
        Task<AuthResultDto> SignUpAsync(SignUpDto signUpDto);
    }
}