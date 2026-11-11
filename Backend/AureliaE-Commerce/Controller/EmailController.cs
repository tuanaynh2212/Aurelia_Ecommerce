using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailResetService _emailResetService;

        public EmailController(EmailResetService emailResetService)
        {
            _emailResetService = emailResetService;
        }

        [HttpPost("ResetPassWord")]
        public async Task<IActionResult> ResetPassWord([FromBody] string email)
        {
            var sent = await _emailResetService.SendPasswordResetAsync(email);
            if (!sent)
                return NotFound(new { message = "Email không tồn tại" });

            return Ok(new { message = "Đã gửi email đặt lại mật khẩu" });
        }

        [HttpPost("ChangePassWord")]
        public async Task<IActionResult> ChangePassWord([FromBody] ChangePassWordRequestDto request)
        {
            var (success, message) = await _emailResetService.ChangePasswordAsync(request);
            return success ? Ok(new { message }) : BadRequest(new { message });
        }
    }
}
