using System.Text.Json;
using AureliaE_Commerce.Common;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ProductController : ControllerBase
    {
        private readonly ProductItemsService _productItemsService;
        private readonly ILogger<ProductController> _logger;

        public ProductController(ProductItemsService productItemsService, ILogger<ProductController> logger)
        {
            _productItemsService = productItemsService;
            _logger = logger;
        }

        [HttpPost("AddItemProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddItemFromFile(IFormFile formFile)
        {
            if (formFile == null || formFile.Length == 0)
                return BadRequest(ApiResponse.Error("File không được để trống"));

            if (!formFile.ContentType.Contains("json"))
                return BadRequest(ApiResponse.Error("File phải là định dạng JSON"));

            try
            {
                using var reader = new StreamReader(formFile.OpenReadStream());
                var json = await reader.ReadToEndAsync();
                var products = JsonSerializer.Deserialize<List<Product>>(json);

                if (products == null || products.Count == 0)
                    return BadRequest(ApiResponse.Error("File JSON không hợp lệ hoặc rỗng"));

                await _productItemsService.AddProduct(products);
                _logger.LogInformation("Imported {Count} products from file", products.Count);

                return Ok(ApiResponse.Success($"Thêm {products.Count} sản phẩm thành công"));
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error parsing JSON file");
                return BadRequest(ApiResponse.Error("File JSON không đúng định dạng"));
            }
        }

        [HttpPost("PostProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddProduct([FromBody] List<Product> products)
        {
            if (products == null || products.Count == 0)
                return BadRequest(ApiResponse.Error("Danh sách sản phẩm không được để trống"));

            try
            {
                await _productItemsService.AddProducts(products);
                _logger.LogInformation("Added {Count} products", products.Count);
                return Ok(ApiResponse.Success($"Thêm {products.Count} sản phẩm thành công"));
            }
            catch (MongoWriteException ex)
            {
                _logger.LogError(ex, "Error adding products");
                return BadRequest(ApiResponse.Error("Lỗi khi thêm sản phẩm vào database"));
            }
        }

        [HttpGet("GetProduct")]
        [ProducesResponseType(typeof(ApiResponse<List<Product>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _productItemsService.GetProduct();
            return Ok(ApiResponse<List<Product>>.SuccessResponse(products, "Lấy danh sách sản phẩm thành công"));
        }

        [HttpGet("GetProductBySearch")]
        [ProducesResponseType(typeof(ApiResponse<List<Product>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchProducts([FromQuery] string? key)
        {
            var products = await _productItemsService.SearchProduct(key);
            return Ok(ApiResponse<List<Product>>.SuccessResponse(products, "Tìm kiếm thành công"));
        }

        [HttpPut("updateQuantityProduct")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateQuantityProduct([FromBody] List<ProductUpdateDto> products)
        {
            if (products == null || products.Count == 0)
                return BadRequest(ApiResponse.Error("Danh sách cập nhật không được để trống"));

            await _productItemsService.UpdateQuantityProduct(products);
            return Ok(ApiResponse.Success("Cập nhật số lượng sản phẩm thành công"));
        }

        [HttpDelete("DeleteProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteProduct([FromQuery] string productId)
        {
            if (string.IsNullOrWhiteSpace(productId))
                return BadRequest(ApiResponse.Error("Product ID không được để trống"));

            var deletedCount = await _productItemsService.DeleteProduct(productId);
            if (deletedCount == 0)
                return BadRequest(ApiResponse.Error("Không tìm thấy sản phẩm để xóa"));

            return Ok(ApiResponse.Success("Xóa sản phẩm thành công"));
        }

        [HttpPut("UpdateProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            if (product == null || string.IsNullOrWhiteSpace(product.id))
                return BadRequest(ApiResponse.Error("Dữ liệu sản phẩm không hợp lệ"));

            var updated = await _productItemsService.UpdateProduct(product);
            if (!updated)
                return BadRequest(ApiResponse.Error("Không tìm thấy sản phẩm để cập nhật"));

            return Ok(ApiResponse.Success("Cập nhật sản phẩm thành công"));
        }
    }
}
