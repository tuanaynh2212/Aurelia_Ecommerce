using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly CouponService _couponService;

        public CouponController(CouponService couponService)
        {
            _couponService = couponService;
        }

        [HttpGet("LaytatCaVoucher")]
        public async Task<IActionResult> GetVoucher()
        {
            var data = await _couponService.GetAllVouchersAsync();
            return Ok(data);
        }

        [HttpPost("AddVoucher")]
        public async Task<IActionResult> AddVoucher([FromBody] MaGiamGia maGiamGia)
        {
            await _couponService.AddVoucherAsync(maGiamGia);
            return Ok(new { message = "Thêm Thành Công" });
        }

        [HttpPost("AddListVoucher")]
        public async Task<IActionResult> AddListVoucher([FromBody] List<MaGiamGia> maGiamGia)
        {
            await _couponService.AddListVoucherAsync(maGiamGia);
            return Ok(new { message = "Thêm Thành Công" });
        }

        [HttpPost("AdjustVoucher")]
        public async Task<IActionResult> AdjustVoucher([FromBody] MaGiamGia maGiamGia)
        {
            var updated = await _couponService.AdjustVoucherAsync(maGiamGia);
            return updated
                ? Ok(new { message = "Cập nhật thành công" })
                : NotFound(new { message = "Không tìm thấy voucher" });
        }

        [HttpDelete("DeleteVoucher")]
        public async Task<IActionResult> DeleteVoucher([FromQuery] string voucherId)
        {
            await _couponService.DeleteVoucherAsync(voucherId);
            return Ok(new { message = "Xóa Thành Công" });
        }

        [HttpPost("UpdateStatusVoucher")]
        public async Task<IActionResult> UpdateStatusVoucher([FromBody] CouponDto dto)
        {
            var updated = await _couponService.UpdateStatusAsync(dto);
            return updated
                ? Ok(new { message = "Cập nhật thành công" })
                : NotFound(new { message = "Không tìm thấy voucher" });
        }

        [HttpPost("SuggestVoucher")]
        public async Task<IActionResult> SuggestVoucher([FromBody] OrderModel orderModel, [FromQuery] string id)
        {
            var result = await _couponService.SuggestVouchersAsync(orderModel, id);
            return result == null ? NotFound("Không tìm thấy khách hàng.") : Ok(result);
        }
    }
}
