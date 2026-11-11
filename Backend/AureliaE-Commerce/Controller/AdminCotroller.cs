using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminReportService _reportService;

        public AdminController(AdminReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("Revenue")]
        public async Task<IActionResult> GetRevenue()
        {
            return Ok(await _reportService.GetRevenueAsync());
        }

        [HttpGet("GetKhachHangAndDiscount")]
        public async Task<IActionResult> GetKhachHangAndDiscount()
        {
            return Ok(await _reportService.GetCustomerAndDiscountAsync());
        }

        [HttpGet("GetDoanhThuCuaHang")]
        public async Task<IActionResult> GetDoanhThu()
        {
            var dataShop = await _reportService.GetShopMonthlyRevenuesAsync();
            return Ok(new { dataShop });
        }

        [HttpGet("ResetSold")]
        public async Task Reset()
        {
            await _reportService.ResetSoldCountsAsync();
        }

        [HttpGet("LaySanPhamBanChay")]
        public async Task<IActionResult> LaySanPhamBanChay()
        {
            var listSold = await _reportService.GetBestSellingProductsAsync();
            return Ok(new { listSold });
        }

        [HttpGet("InformationShop")]
        public async Task<IActionResult> GetInformationShop()
        {
            return Ok(await _reportService.GetShopsInformationAsync());
        }

        [HttpGet("DoanhThuCaNam")]
        public async Task<IActionResult> GetRevenueYear()
        {
            return Ok(await _reportService.GetYearlyReportAsync());
        }
    }
}
