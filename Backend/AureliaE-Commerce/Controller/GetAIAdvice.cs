using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetAIAdvice : ControllerBase
    {
        private readonly AiSizeService _aiSizeService;
        private readonly JwtTokenService _jwtTokenService;

        public GetAIAdvice(AiSizeService aiSizeService, JwtTokenService jwtTokenService)
        {
            _aiSizeService = aiSizeService;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("GetAdviceSize")]
        public async Task<IActionResult> GetAdviceSize([FromBody] ProductGetAdviceFromUserDto dto)
        {
            var userId = _jwtTokenService.GetSubjectFromRequestCookie(Request, "client");
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var (hasMeasurements, sizeName, note, message) = await _aiSizeService.GetAdviceSizeAsync(userId, dto);
            if (!hasMeasurements)
                return BadRequest(message);

            if (sizeName == null)
                return Ok(new { message });

            return Ok(new
            {
                size = sizeName,
                note,
                message
            });
        }
    }
}
