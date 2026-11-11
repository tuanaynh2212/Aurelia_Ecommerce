using AureliaE_Commerce.Model.Banner;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly BannerService _bannerService;

        public BannerController(BannerService bannerService)
        {
            _bannerService = bannerService;
        }

        [HttpGet("GetBanner")]
        public async Task<IActionResult> GetAllBanner()
        {
            var (mainBanner, storyBanner) = await _bannerService.GetAllBannersAsync();
            return Ok(new { mainBanner, storyBanner });
        }

        [HttpPost("AddMainBanner")]
        public async Task<IActionResult> AddBanner([FromBody] MainBanner mainBanner)
        {
            await _bannerService.AddMainBannerAsync(mainBanner);
            return Ok("Thêm Thành Công!");
        }

        [HttpPost("AddStoryBanner")]
        public async Task<IActionResult> AddStoryBanner([FromBody] StoryBanner story)
        {
            await _bannerService.AddStoryBannerAsync(story);
            return Ok("Thêm Thành Công!");
        }

        [HttpPost("AdjustMainBanner")]
        public async Task<IActionResult> AdjustBanner([FromBody] MainBanner mainBanner)
        {
            var updated = await _bannerService.AdjustMainBannerAsync(mainBanner);
            return updated ? Ok("Cập nhật thành công!") : NotFound("Không tìm thấy banner để cập nhật.");
        }

        [HttpPost("AdjustStoryBanner")]
        public async Task<IActionResult> AdjustStoryBanner([FromBody] StoryBanner storyBanner)
        {
            var updated = await _bannerService.AdjustStoryBannerAsync(storyBanner);
            return updated ? Ok("Cập nhật thành công!") : NotFound("Không tìm thấy banner để cập nhật.");
        }
    }
}
