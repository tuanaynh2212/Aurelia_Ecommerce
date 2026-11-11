using System.Text.Json;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonCollectionController : ControllerBase
    {
        private readonly SeasonCollectionService _seasonService;

        public SeasonCollectionController(SeasonCollectionService seasonService)
        {
            _seasonService = seasonService;
        }

        [HttpGet("GetCollection")]
        public async Task<IActionResult> GetCollection()
        {
            var data = await _seasonService.GetAllAsync();
            return Ok(data);
        }

        [HttpPost("AddSeason")]
        public async Task<IActionResult> AddProduct(IFormFile formFile)
        {
            if (formFile == null || formFile.Length == 0)
                return BadRequest("No file uploaded.");

            using var reader = new StreamReader(formFile.OpenReadStream());
            var json = await reader.ReadToEndAsync();

            List<LuxuryCollection>? result;
            try
            {
                result = JsonSerializer.Deserialize<List<LuxuryCollection>>(json);
            }
            catch (JsonException)
            {
                return BadRequest("Invalid JSON format.");
            }

            if (result == null || result.Count == 0)
                return BadRequest("No valid season data found.");

            await _seasonService.ReplaceAllAsync(result);
            return Ok(new { message = "Season data added successfully.", count = result.Count });
        }

        [HttpGet("GetProductWithId")]
        public async Task<IActionResult> Getproduct([FromQuery] string id)
        {
            var seasonCollectionsWithProducts = await _seasonService.GetWithProductsAsync(id);
            return Ok(new { SeasonCollectionsWithProducts = seasonCollectionsWithProducts });
        }

        [HttpGet("GetStatCollection")]
        public async Task<IActionResult> GetStatCollection()
        {
            var stats = await _seasonService.GetStatsAsync();
            return Ok(stats);
        }

        [HttpPost("AddCollection")]
        public async Task<IActionResult> AddCollection([FromBody] LuxuryCollection luxuryCollection)
        {
            await _seasonService.AddAsync(luxuryCollection);
            return Ok("Thêm Thành Công");
        }

        [HttpPut("UpdateCollection")]
        public async Task<IActionResult> UpdateCollection([FromBody] LuxuryCollection luxuryCollection)
        {
            var updated = await _seasonService.UpdateAsync(luxuryCollection);
            return updated ? Ok("Cập Nhật Thành Công!") : NotFound("Collection not found.");
        }

        [HttpDelete("DeleteCollection")]
        public async Task<IActionResult> DeleteCollection([FromQuery] string collectionId)
        {
            await _seasonService.DeleteAsync(collectionId);
            return Ok("Xóa Thành Công!");
        }
    }
}
