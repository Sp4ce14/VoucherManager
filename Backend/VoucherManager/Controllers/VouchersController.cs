using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VoucherManager.Dtos;
using VoucherManager.Models;
using VoucherManager.Repositories;

namespace VoucherManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VouchersController : ControllerBase
    {
        private readonly IVouchersRepository _vouchersRepository;

        public VouchersController(IVouchersRepository vouchersRepository)
        {
            _vouchersRepository = vouchersRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVouchers()
        {
            var userRole = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            string? userId = null;
            if (userRole == "user")
            {
                userId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            List<VoucherDto> vouchers = await _vouchersRepository.GetAllAsync(userId);
            return Ok(vouchers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucher([FromRoute] int? id)
        {
            if (id == null)
            {
                return BadRequest();
            }
            var userRole = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            string? userId = null;
            if (userRole == "user")
            {
                userId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            VoucherDto voucher = await _vouchersRepository.GetVoucherAsync(id, userId);
            if (voucher.Error != null)
            {
                return NotFound(voucher.Error);
            }
            return Ok(voucher);
        }
        [Authorize(Roles = "user")]
        [HttpPost]
        public async Task<IActionResult> AddVoucher([FromBody] VoucherDto voucher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid entry");
            }
            var userId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var result = await _vouchersRepository.AddAsync(voucher, userId);

            return CreatedAtAction(nameof(GetVoucher), new { id = result.Id }, voucher);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditVoucher([FromBody] VoucherDto voucher, [FromRoute] int? id)
        {
            if (id == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid entry");
            }
            var userRole = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            string? userId = null;
            if (userRole == "user")
            {
                userId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User couldn't be extracted from claims.");
                }
            }
            var result = await _vouchersRepository.EditAsync(voucher, id, userId);
            if (result.Error != null)
            {
                return BadRequest(result.Error);
            }
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoucher([FromRoute] int? id)
        {
            if (id == null)
            {
                return BadRequest();
            }
            var result = await _vouchersRepository.DeleteAsync(id);
            if (result.Error != null)
            {
                return NotFound(result.Error);
            }
            return NoContent();
        }
    }
}
