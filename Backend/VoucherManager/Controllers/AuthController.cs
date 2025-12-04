using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using VoucherManager.Dtos;
using VoucherManager.Repositories;

namespace VoucherManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
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
            return Ok(result);
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
            return Ok(result);
        }
        [HttpPost("Refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshReqDto req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var x = await _authRepository.TokenRefresh(req);
            return Ok(x);
        }
    }
}
