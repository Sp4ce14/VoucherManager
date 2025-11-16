using Microsoft.AspNetCore.Identity;
using VoucherManager.Dtos;

namespace VoucherManager.Repositories
{
    public interface IAuthRepository
    {
        Task<AuthResult> SignUpAsync(SignUpDto signUpDto);
        Task<AuthResult> LoginAsync(LoginDto loginDto);
    }
}