using System.Text.Json;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly ShopService _shopService;

        public ShopController(ShopService service)
        {
            _shopService = service;
        }

        [HttpPost("AddShop")]
        public async Task<IActionResult> AddShop(IFormFile file)
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var json = await reader.ReadToEndAsync();
            var result = JsonSerializer.Deserialize<List<Shop>>(json);

            if (result == null || result.Count == 0)
                return BadRequest("File JSON không hợp lệ hoặc rỗng");

            await _shopService.AddShop(result);
            return Ok("Thêm sản phẩm thành công ✅");
        }

        [HttpPost("GetShop")]
        public async Task<IActionResult> GetShop([FromBody] ShopFindDto dto)
        {
            return Ok(await _shopService.Shops(dto));
        }

        [HttpGet("GetSHopById")]
        public async Task<IActionResult> getShopById([FromQuery] string id)
        {
            var data = await _shopService.Shop(id);
            return Ok(data.FirstOrDefault());
        }

        [HttpPost("AddAppointment")]
        public async Task<IActionResult> addAppointment([FromBody] Appointment appointment, [FromQuery] string shopId)
        {
            await _shopService.AddAppointmentAsync(appointment, shopId);
            return Ok(new { message = "Thêm Lịch Hẹn Thành Công!" });
        }

        [HttpPost("LayNgayHen")]
        public async Task<IActionResult> LayAppointmentShop([FromBody] UploadGetAppointment getAppointment)
        {
            var slots = await _shopService.GetAppointmentCreatedDatesAsync(getAppointment);
            return slots == null ? Ok("None") : Ok(slots);
        }

        [HttpPost("LayTatCaSlotTheoNgay")]
        public async Task<IActionResult> LaySlotTheoNgay([FromBody] GetSlotDto dto)
        {
            var slots = await _shopService.GetSlotsByDateAsync(dto);
            return slots == null
                ? NotFound(new { message = "Không tìm thấy shop hoặc không có appointment trong ngày này" })
                : Ok(slots);
        }

        [HttpPost("SapXepDonChoCuaHang")]
        public async Task<IActionResult> SapXepDon([FromBody] OrderModel orderModel, bool nana)
        {
            var (nearestStore, distance, shippingFee) = await _shopService.AssignOrderToNearestStoreAsync(orderModel, nana);
            if (nearestStore == null)
                return NotFound("Không có cửa hàng nào còn đủ hàng để xử lý đơn.");

            return Ok(new
            {
                Message = nana ? "Ước lượng chi phí vận chuyển" : "Đã gán đơn cho cửa hàng",
                StoreId = nearestStore.shopId,
                Distance = distance,
                ShippingFee = shippingFee
            });
        }

        [HttpGet("LayDonHangTheoId")]
        public async Task<IActionResult> GetDonHangTheoId([FromQuery] string id)
        {
            var result = await _shopService.GetOrderByIdAsync(id);
            return result == null ? BadRequest() : Ok(result);
        }

        [HttpGet("DataForDashBoard")]
        public async Task<IActionResult> DateForDashBoard([FromQuery] string shopId)
        {
            var metrics = await _shopService.GetDashboardMetricsAsync(shopId);
            return metrics == null ? BadRequest() : Ok(metrics);
        }

        [HttpGet("LayDanhSachLichHenVaDonHang")]
        public async Task<IActionResult> LayDanhSachLichHen([FromQuery] string shopId)
        {
            return Ok(await _shopService.GetAppointmentsAndOrdersAsync(shopId));
        }

        [HttpPost("UpdateTrangThai")]
        public async Task<IActionResult> UpdateTrangThaiDonHang([FromBody] UpdateStatusDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            var message = await _shopService.UpdateOrderStatusAsync(dto);
            return Ok(new { message });
        }

        [HttpGet("LaySanPham")]
        public async Task<IActionResult> LaySanPham([FromQuery] string shopId)
        {
            try
            {
                var summary = await _shopService.GetShopProductsSummaryAsync(shopId);
                return summary == null ? NotFound("Không tìm thấy shop này.") : Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UploadSanPham")]
        public async Task<IActionResult> UploadSanPham([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
                await _shopService.UploadProductAsync(product, shopId);
                return Ok(new { message = "Upload Thanh Cong" });
            }
            catch
            {
                return BadRequest(new { message = "Upload Khong Thanh Cong" });
            }
        }

        [HttpPost("SuaSanPham")]
        public async Task<IActionResult> EditSanPham([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
                var updated = await _shopService.UpdateShopProductAsync(product, shopId);
                return updated
                    ? Ok(new { message = "Cập nhật sản phẩm thành công!" })
                    : NotFound(new { message = "Không tìm thấy sản phẩm để cập nhật." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật sản phẩm.", error = ex.Message });
            }
        }

        [HttpPost("PostMessage")]
        public async Task<IActionResult> PostNotifycation([FromBody] Notifycation notifycation)
        {
            var sent = await _shopService.PostNotificationAsync(notifycation);
            return sent ? Ok("Notification sent and saved") : NotFound("Shop not found");
        }

        [HttpGet("GetNoti")]
        public async Task<IActionResult> GetNoti([FromQuery] string shopId)
        {
            return Ok(await _shopService.GetNotificationsAsync(shopId));
        }

        [HttpPost("CheckNotifycation")]
        public async Task CheckNotifycation([FromBody] AddCheckDto dto)
        {
            await _shopService.MarkNotificationCheckedAsync(dto);
        }

        [HttpGet("GetAllCustomer")]
        public async Task<IActionResult> GetAllCustomer()
        {
            return Ok(await _shopService.GetCustomerStatsAsync());
        }
    }
}
