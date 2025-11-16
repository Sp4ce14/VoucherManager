using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
            List<VoucherDto> vouchers = await _vouchersRepository.GetAllAsync();
            return Ok(vouchers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucher([FromRoute] int? id)
        {
            if (id == null)
            {
                return BadRequest();
            }
            VoucherDto voucher = await _vouchersRepository.GetVoucherAsync(id);
            if (voucher.Error != null)
            {
                return NotFound(voucher.Error);
            }
            return Ok(voucher);
        }

        [HttpPost]
        public async Task<IActionResult> AddVoucher([FromBody] VoucherDto voucher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid entry");
            }
            var result = await _vouchersRepository.AddAsync(voucher);

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
            var result = await _vouchersRepository.EditAsync(voucher, id);
            if (result.Error != null)
            {
                return BadRequest(result.Error);
            }
            return NoContent();
        }

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
