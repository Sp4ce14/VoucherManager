  using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using System.Net;
using VoucherManager.Data;
using VoucherManager.Dtos;
using VoucherManager.Repositories;

namespace VoucherManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly AppDbContext _context;

        public AuthController(IAuthRepository authRepository, AppDbContext context)
        {
            _authRepository = authRepository;
            _context = context;
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authRepository.SignUpAsync(user);
            if (result.Error != null)
            {
                return BadRequest(result.Error);
            }
            SetRefreshCookie(result.RefreshToken);
            return Ok(result.Token);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authRepository.LoginAsync(user);
            if (result.Error != null)
            {
                return BadRequest(result.Error);
            }
            SetRefreshCookie(result.RefreshToken);
            return Ok(result.Token);
        }
        [HttpPost("Refresh")]
        public async Task<IActionResult> Refresh([FromBody] string expiredToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var refreshToken = Request.Cookies["refresh"];
            if (refreshToken == null)
            {
                return BadRequest("No refresh Token Sent, logged out");
            }
            var req = new RefreshReqDto { RefreshToken = refreshToken, Token = expiredToken};
            var x = await _authRepository.TokenRefresh(req);
            SetRefreshCookie(x.RefreshToken);
            return Ok(x.Token);
        }
        private async void SetRefreshCookie(string refreshCookie)
        {
            var cookieOptions = new CookieOptions()
            {
                Expires = await _context.RefreshTokens.Where(x => x.Token == refreshCookie).Select(x => x.DateExpire).FirstOrDefaultAsync(),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/auth/refresh",
            };
            Response.Cookies.Append("refresh", refreshCookie, cookieOptions);
        }
    }
}
