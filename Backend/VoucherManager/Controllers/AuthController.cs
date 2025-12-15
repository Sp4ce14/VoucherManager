using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            await SetRefreshCookie(result.RefreshToken);
            return Ok(new { result.Token });
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
            await SetRefreshCookie(result.RefreshToken);
            return Ok(new { result.Token });
        }
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            var refTokenToRevoke = Request.Cookies["refresh"];
            if (refTokenToRevoke == null)
            {
                return BadRequest("No refresh cookie sent");
            }
            var refToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refTokenToRevoke);
            if (refToken == null)
            {
                return BadRequest("Invalid cookie sent");
            }
            Response.Cookies.Delete("refresh");
            refToken.IsRevoked = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [Authorize]
        [HttpPost("Refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshReqDto expiredReq)
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
            var req = new RefreshReqDto { RefreshToken = refreshToken, Token = expiredReq.Token};
            var result = await _authRepository.TokenRefresh(req);
            if (result.Error != null)
            {
                return BadRequest(result.Error);
            }
            await SetRefreshCookie(result.RefreshToken);
            return Ok(new { result.Token });
        }
        private async Task SetRefreshCookie(string refreshCookie)
        {
            var cookieOptions = new CookieOptions()
            {
                Expires = await _context.RefreshTokens.Where(x => x.Token == refreshCookie).Select(x => x.DateExpire).FirstOrDefaultAsync(),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
            };
            Response.Cookies.Append("refresh", refreshCookie, cookieOptions);
        }
    }
}
