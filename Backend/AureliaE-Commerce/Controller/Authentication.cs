using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private static readonly string[] ValidAccountTypes = { "client", "shop", "admin" };

        private readonly AuthService _authService;

        public AuthenticationController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] SignUpDto dto) =>
            ToAuthResponse(await _authService.RegisterClientAsync(dto));

        [HttpPost("ShopRegister")]
        public async Task<IActionResult> ShopRegister([FromBody] ShopSignUpDTo dto) =>
            ToAuthResponse(await _authService.RegisterShopAsync(dto));

        [HttpPost("CreateAdminAccount")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> CreateAdmin([FromBody] SignUpDto dto) =>
            ToAuthResponse(await _authService.CreateAdminAsync(dto));

        [HttpPost("LogIn")]
        public async Task<IActionResult> LogInAccount([FromBody] LoginDto loginDto) =>
            ToAuthResponse(await _authService.LoginClientAsync(loginDto));

        [HttpPost("LogInWithFirebase")]
        public async Task<IActionResult> LogInWithFirebase([FromQuery] string token) =>
            ToAuthResponse(await _authService.LoginWithFirebaseAsync(token));

        [HttpPost("LogInShop")]
        public async Task<IActionResult> LogInShop([FromBody] LoginDto login) =>
            ToAuthResponse(await _authService.LoginShopAsync(login), includeSuccessFlag: false);

        [HttpPost("LogInAdminSite")]
        public async Task<IActionResult> LogInAdminSite([FromBody] LoginDto login) =>
            ToAuthResponse(await _authService.LoginAdminAsync(login), includeSuccessFlag: false);

        [HttpDelete("LogOut")]
        public IActionResult LogOut([FromQuery] string typeAccount)
        {
            if (!ValidAccountTypes.Contains(typeAccount))
                return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });

            var cookieName = JwtTokenService.ResolveCookieName(typeAccount)!;
            Response.Cookies.Delete(cookieName, JwtTokenService.CreateAuthCookieOptions());
            return Ok(new { success = true, message = "Đăng xuất thành công" });
        }

        [HttpGet("GetData")]
        public async Task<IActionResult> GetAllClients([FromQuery] string typeAccount)
        {
            if (!ValidAccountTypes.Contains(typeAccount))
                return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });

            var cookieName = JwtTokenService.ResolveCookieName(typeAccount)!;
            var token = Request.Cookies[cookieName];
            var result = await _authService.GetProfileAsync(typeAccount, token);

            if (result.IsBadRequest)
                return BadRequest(new { success = false, message = result.ErrorMessage });

            if (!result.IsAuthorized)
                return Unauthorized(new { success = false, message = result.ErrorMessage });

            return Ok(result.Profile);
        }

        private IActionResult ToAuthResponse(AuthActionResult result, bool includeSuccessFlag = true)
        {
            if (!result.Success)
                return BadRequest(new { success = false, message = result.Message });

            if (!string.IsNullOrEmpty(result.CookieName) && !string.IsNullOrEmpty(result.Token))
            {
                var options = JwtTokenService.CreateAuthCookieOptions(result.ExpireDays);
                Response.Cookies.Append(result.CookieName, result.Token, options);
            }

            return includeSuccessFlag
                ? Ok(new { success = true, message = result.Message })
                : Ok(new { message = result.Message });
        }
    }
}
