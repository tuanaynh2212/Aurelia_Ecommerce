using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private const int ClientDays = 7;
        private const int ShopDays = 3;
        private const int AdminDays = 7;
        private const int BcryptWorkFactor = 12;

        private static readonly string[] AccountTypes = { "client", "shop", "admin" };

        private readonly IMongoCollection<Client> _collection;
        private readonly IMongoCollection<ShopAccount> mongoCollection;
        private readonly IMongoCollection<AdminAccount> collection;
        private readonly IConfiguration _configuration;

        public AuthenticationController(MongoDbContext dbContext, IConfiguration configuration)
        {
            _collection = dbContext.Client;
            mongoCollection = dbContext.ShopAccount;
            collection = dbContext.AdminAccount;
            _configuration = configuration;
        }

        #region JWT & Cookie

        private byte[] GetKey() =>
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Thiếu cấu hình Jwt:Key"));

        private string GenerateToken(IEnumerable<Claim> claims, int expireDays)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(expireDays),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(GetKey()),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }

        private string Generate(Client client) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, client.Id),
            new Claim(JwtRegisteredClaimNames.Email, client.Email),
            new Claim(ClaimTypes.Name, client.Name),
        }, ClientDays);

        private string GenerateAccount(ShopAccount shop) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, shop.id),
            new Claim(JwtRegisteredClaimNames.Email, shop.email),
            new Claim("shopId", shop.shopId),
        }, ShopDays);

        private string GenerateAdminAccount(AdminAccount admin) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, admin.Id),
            new Claim(JwtRegisteredClaimNames.Email, admin.Email),
        }, AdminDays);

        private static CookieOptions BaseCookieOptions() => new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        };

        private void SetAuthCookie(string cookieName, string token, int days)
        {
            var options = BaseCookieOptions();
            options.Expires = DateTimeOffset.UtcNow.AddDays(days);
            Response.Cookies.Append(cookieName, token, options);
        }

        private string? GetUserIdFromToken(string token)
        {
            try
            {
                new JwtSecurityTokenHandler().ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(GetKey()),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out var validated);

                return ((JwtSecurityToken)validated).Subject;
            }
            catch
            {
                return null;
            }
        }

        #endregion

        #region Register

        private async Task<IActionResult> RegisterAccount<T>(
            string email,
            string password,
            IMongoCollection<T> collection,
            Func<string, T> buildEntity,
            Func<T, string> generateToken,
            string cookieName,
            int cookieDays,
            string successMessage,
            Expression<Func<T, bool>> emailExistsFilter)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }

            if (password.Length < 6)
            {
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự" });
            }

            if (await collection.Find(emailExistsFilter).AnyAsync())
            {
                return BadRequest(new { success = false, message = "Email đã tồn tại" });
            }

            var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: BcryptWorkFactor);
            var entity = buildEntity(hash);
            await collection.InsertOneAsync(entity);

            SetAuthCookie(cookieName, generateToken(entity), cookieDays);
            return Ok(new { success = true, message = successMessage });
        }

        [HttpPost("Register")]
        public Task<IActionResult> RegisterUser([FromBody] SignUpDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.UserName))
            {
                return Task.FromResult<IActionResult>(
                    BadRequest(new { success = false, message = "Không được để trống Tên, Email hoặc Mật khẩu" }));
            }

            return RegisterAccount(
                dto.Email,
                dto.Password,
                _collection,
                hash => new Client
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = dto.Email,
                    PassWord = hash,
                    Name = dto.UserName,
                    Point = 0,
                    Tier = "Bronze",
                    NgayTaoTaiKhoan = DateTime.Now
                },
                Generate,
                "access_token_client",
                ClientDays,
                "Đăng ký thành công",
                u => u.Email == dto.Email);
        }

        [HttpPost("ShopRegister")]
        public Task<IActionResult> ShopRegister([FromBody] ShopSignUpDTo dto)
        {
            if (dto == null)
            {
                return Task.FromResult<IActionResult>(
                    BadRequest(new { success = false, message = "Dữ liệu đăng ký không được để trống" }));
            }

            return RegisterAccount(
                dto.Email,
                dto.Password,
                mongoCollection,
                hash => new ShopAccount
                {
                    id = Guid.NewGuid().ToString(),
                    email = dto.Email,
                    password = hash,
                    shopId = dto.shopId,
                    NgayTaoTaiKhoan = DateTime.Now
                },
                GenerateAccount,
                "access_token_shop",
                ShopDays,
                "Đăng ký shop thành công",
                a => a.email == dto.Email);
        }

        [HttpPost("CreateAdminAccount")]
        [Authorize(Roles = "SuperAdmin")]
        public Task<IActionResult> CreateAdmin([FromBody] SignUpDto dto)
        {
            if (dto == null)
            {
                return Task.FromResult<IActionResult>(
                    BadRequest(new { success = false, message = "Dữ liệu không được để trống" }));
            }

            return RegisterAccount(
                dto.Email,
                dto.Password,
                collection,
                hash => new AdminAccount
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = dto.Email,
                    Password = hash
                },
                GenerateAdminAccount,
                "access_token_admin",
                AdminDays,
                "Đăng ký thành công",
                a => a.Email == dto.Email);
        }

        #endregion

        #region Login

        [HttpPost("LogIn")]
        public async Task<IActionResult> LogInAccount([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }

            var data = await _collection.Find(a => a.Email == loginDto.Email).FirstOrDefaultAsync();

            if (data == null)
            {
                return BadRequest(new { success = false, message = "Không tìm thấy Email" });
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, data.PassWord))
            {
                return BadRequest(new { success = false, message = "Sai Email hoặc Mật khẩu" });
            }

            SetAuthCookie("access_token_client", Generate(data), ClientDays);
            return Ok(new { success = true, message = "Đăng nhập thành công" });
        }

        [HttpPost("LogInWithFirebase")]
        public async Task<IActionResult> LogInWithFirebase([FromQuery] string token)
        {
            FirebaseToken decoded;
            try
            {
                decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
            }
            catch (FirebaseAuthException)
            {
                return BadRequest(new { success = false, message = "Token không hợp lệ" });
            }

            var uid = decoded.Uid;
            if (string.IsNullOrEmpty(uid))
            {
                return BadRequest(new { success = false, message = "Token không hợp lệ" });
            }

            var data = await _collection.Find(a => a.Id == uid).FirstOrDefaultAsync();

            if (data == null)
            {
                data = new Client
                {
                    Id = uid,
                    Email = decoded.Claims["email"].ToString(),
                    Name = decoded.Claims["name"].ToString(),
                    Point = 0,
                    Tier = "Bronze",
                    NgayTaoTaiKhoan = DateTime.Now
                };
                await _collection.InsertOneAsync(data);
            }

            SetAuthCookie("access_token_client", Generate(data), ClientDays);
            return Ok(new { success = true, message = "Đăng nhập thành công" });
        }

        [HttpPost("LogInShop")]
        public async Task<IActionResult> LogInShop([FromBody] LoginDto login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }

            var data = await mongoCollection.Find(a => a.email == login.Email).FirstOrDefaultAsync();

            if (data == null)
            {
                return BadRequest(new { success = false, message = "Email Không Tồn Tại" });
            }

            if (!BCrypt.Net.BCrypt.Verify(login.Password, data.password))
            {
                return BadRequest(new { success = false, message = "Sai Mật Khẩu" });
            }

            SetAuthCookie("access_token_shop", GenerateAccount(data), ShopDays);
            return Ok(new { message = "Đăng Nhập Thành Công" });
        }

        [HttpPost("LogInAdminSite")]
        public async Task<IActionResult> LogInAdminSite([FromBody] LoginDto login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }

            var data = await collection.Find(a => a.Email == login.Email).FirstOrDefaultAsync();

            if (data == null)
            {
                return BadRequest(new { success = false, message = "Email Không Tồn Tại" });
            }

            if (!BCrypt.Net.BCrypt.Verify(login.Password, data.Password))
            {
                return BadRequest(new { success = false, message = "Sai Mật Khẩu" });
            }

            SetAuthCookie("access_token_admin", GenerateAdminAccount(data), AdminDays);
            return Ok(new { message = "Đăng Nhập Thành Công" });
        }

        #endregion

        #region Session

        [HttpDelete("LogOut")]
        public IActionResult LogOut([FromQuery] string typeAccount)
        {
            if (!AccountTypes.Contains(typeAccount))
            {
                return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });
            }

            Response.Cookies.Delete($"access_token_{typeAccount}", BaseCookieOptions());
            return Ok(new { success = true, message = "Đăng xuất thành công" });
        }

        [HttpGet("GetData")]
        public async Task<IActionResult> GetAllClients([FromQuery] string typeAccount)
        {
            if (!AccountTypes.Contains(typeAccount))
            {
                return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });
            }

            var token = Request.Cookies[$"access_token_{typeAccount}"];
            var userId = string.IsNullOrEmpty(token) ? null : GetUserIdFromToken(token);

            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "Token không hợp lệ hoặc đã hết hạn" });
            }

            switch (typeAccount)
            {
                case "client":
                {
                    var c = await _collection.Find(a => a.Id == userId).FirstOrDefaultAsync();
                    if (c == null) return Unauthorized(new { success = false, message = "Tài khoản không tồn tại" });
                    return Ok(new { c.Id, c.Email, c.Name, c.Point, c.Tier, c.NgayTaoTaiKhoan });
                }
                case "shop":
                {
                    var s = await mongoCollection.Find(a => a.id == userId).FirstOrDefaultAsync();
                    if (s == null) return Unauthorized(new { success = false, message = "Tài khoản không tồn tại" });
                    return Ok(new { s.id, s.email, s.shopId, s.NgayTaoTaiKhoan });
                }
                default:
                {
                    var ad = await collection.Find(a => a.Id == userId).FirstOrDefaultAsync();
                    if (ad == null) return Unauthorized(new { success = false, message = "Tài khoản không tồn tại" });
                    return Ok(new { ad.Id, ad.Email });
                }
            }
        }

        #endregion
    }
}