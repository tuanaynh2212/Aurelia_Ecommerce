using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ClientService _clientService;
        private readonly JwtTokenService _jwtTokenService;

        public ClientController(ClientService clientService, JwtTokenService jwtTokenService)
        {
            _clientService = clientService;
            _jwtTokenService = jwtTokenService;
        }

        private string? GetUserId() => _jwtTokenService.GetSubjectFromRequestCookie(Request, "user");

        [HttpPost("AddItems")]
        public async Task<IActionResult> AddItems([FromBody] Product product)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            if (product == null || string.IsNullOrWhiteSpace(product.id))
                return BadRequest(new { message = "Dữ liệu sản phẩm không hợp lệ" });

            var added = await _clientService.AddFavouriteAsync(userId, product);
            return added
                ? Ok(new { message = "Thêm sản phẩm thành công" })
                : BadRequest(new { message = "Không tìm thấy user hoặc thêm thất bại" });
        }

        [HttpDelete("RemoveFavourite/{productId}")]
        public async Task<IActionResult> RemoveFavourite(string productId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            if (string.IsNullOrWhiteSpace(productId))
                return BadRequest(new { message = "Thiếu mã sản phẩm" });

            var removed = await _clientService.RemoveFavouriteAsync(userId, productId);
            return removed
                ? Ok(new { message = "Đã xóa khỏi danh sách yêu thích" })
                : NotFound(new { message = "Không tìm thấy user" });
        }

        [HttpPost("AutoAddGioHangKhiLog")]
        public async Task<IActionResult> AddDon([FromBody] List<ItemOrder> Product)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.AddCartItemsAsync(userId, Product);
            return Ok(new { s = "Add thành công", p = Product });
        }

        [HttpDelete("XoaGioHang")]
        public async Task<IActionResult> XoaGioHang()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.ClearCartAsync(userId);
            return Ok("Đã xóa toàn bộ giỏ hàng");
        }

        [HttpGet("GetItemFavourite")]
        public async Task<IActionResult> GetItemFavourite()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var client = await _clientService.GetByIdAsync(userId);
            if (client == null) return NotFound("Client not found");

            var items = (client.SanPhamYeuThich ?? new List<Product>())
                .Where(p => p != null && !string.IsNullOrEmpty(p.id))
                .GroupBy(p => p.id)
                .Select(g => g.First())
                .ToList();

            return Ok(items);
        }

        [HttpPost("AddDonHang")]
        public async Task<IActionResult> AddDonHang([FromBody] OrderModel order, [FromQuery] string shopId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var added = await _clientService.AddOrderAsync(userId, order, shopId);
            return added
                ? Ok(new { message = "Thêm sản phẩm thành công" })
                : BadRequest(new { message = "Không tìm thấy user hoặc thêm thất bại" });
        }

        [HttpGet("LayDonHang")]
        public async Task<IActionResult> LayDonHang()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var client = await _clientService.GetByIdAsync(userId);
            if (client == null) return NotFound("Client not found");

            return Ok(client.DonHangCuaBan);
        }

        [HttpGet("LayDonHangGanDay")]
        public async Task<IActionResult> LayDonHangGanDay()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var latestDate = await _clientService.GetLatestOrderDateAsync(userId);
            if (latestDate == null) return NotFound("Không tìm thấy đơn hàng nào");

            return Ok(new { ngayMoiNhat = latestDate });
        }

        [HttpGet("GetSoLuongDonHang")]
        public async Task<IActionResult> GetSoLuongDonHang()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var summary = await _clientService.GetOrderSummaryAsync(userId);
            if (summary == null) return NotFound(new { message = "User not found" });

            return Ok(new { SoLuongDon = summary.Value.Count, TongTien = summary.Value.TotalAmount });
        }

        [HttpPost("UpMeasure")]
        public async Task<IActionResult> UpMeasure([FromBody] Measure measure)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.UpdateMeasureAsync(userId, measure);
            return Ok(measure);
        }

        [HttpGet("GetSoDo")]
        public async Task<IActionResult> GetSoDo()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var client = await _clientService.GetByIdAsync(userId);
            if (client?.SoDoNgDUng == null) return BadRequest();

            var m = client.SoDoNgDUng;
            return Ok(new Measure
            {
                vai = m.vai ?? "",
                eo = m.eo ?? "",
                chieuCao = m.chieuCao ?? "",
                nguc = m.nguc ?? "",
                hong = m.hong ?? ""
            });
        }

        [HttpPost("AddCuocHenUser")]
        public async Task<IActionResult> AddCuocHen([FromBody] ClientAppointment clientAppointment)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.AddAppointmentAsync(userId, clientAppointment);
            return Ok(new { message = "Thêm Lịch Hẹn Thành Công!" });
        }

        [HttpGet("LayCuocHenUser")]
        public async Task<IActionResult> LayCuocHen()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _clientService.GetByIdAsync(userId);
            if (user == null) return NotFound(new { message = "Người dùng không tồn tại" });

            var appointments = user.LichSuCuocHen?.ToList();
            if (appointments == null || appointments.Count == 0)
                return Ok(new { message = "Chưa có cuộc hẹn nào" });

            return Ok(appointments);
        }

        [HttpPost("LuuDiaChi")]
        public async Task<IActionResult> LuuAddress([FromBody] ThongTinCaNhan thongTinCaNhan)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.SaveAddressAsync(userId, thongTinCaNhan);
            return Ok(new { message = "Lưu Thành Công" });
        }

        [HttpGet("LayDiaChi")]
        public async Task<IActionResult> LayDiaChi()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var client = await _clientService.GetByIdAsync(userId);
            if (client == null) return NotFound("Client not found");

            return Ok(client.ThongTinDatHang);
        }

        [HttpPost("XoaDiaChi")]
        public async Task<IActionResult> XoaDiaChi([FromBody] ThongTinCaNhan thongTinCaNhan)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var deleted = await _clientService.DeleteAddressAsync(userId, thongTinCaNhan);
            return deleted
                ? Ok(new { message = "Xóa thành công" })
                : NotFound(new { message = "Không tìm thấy địa chỉ" });
        }

        [HttpPost("PaypalPayment")]
        public async Task<IActionResult> PaypalPayment([FromBody] PaypalDto paypalDto)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var (success, errorMessage, orderId, amount) = await _clientService.VerifyPayPalPaymentAsync(paypalDto);
            if (!success)
                return BadRequest(new { message = errorMessage });

            return Ok(new { message = "Thanh toán thành công", orderId, amount });
        }

        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCustomer updateProfileCustomer)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var updatedUser = await _clientService.UpdateProfileAsync(userId, updateProfileCustomer);
            if (updatedUser == null) return NotFound(new { message = "Người dùng không tồn tại" });

            return Ok(new { message = "Cập Nhật Thành Công", user = updatedUser });
        }

        [HttpPost("UpdateTier")]
        public async Task<IActionResult> UpdateTier()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.UpdateTierAsync(userId);
            return Ok();
        }

        [HttpPost("HuyDonHang")]
        public async Task<IActionResult> HuyDonHang([FromQuery] string orderId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                await _clientService.CancelOrderAsync(userId, orderId);
                return Ok(new { message = "Đã Hủy Thành Công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
