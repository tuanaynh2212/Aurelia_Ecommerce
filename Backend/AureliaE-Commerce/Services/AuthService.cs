using System.Linq.Expressions;
using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using FirebaseAdmin.Auth;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public record AuthActionResult(
        bool Success,
        string Message,
        string? Token = null,
        string? CookieName = null,
        int ExpireDays = 0);

    public record AccountProfileResult(
        bool IsAuthorized,
        bool IsBadRequest,
        string? ErrorMessage,
        object? Profile);

    public class AuthService
    {
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<ShopAccount> _shopAccounts;
        private readonly IMongoCollection<AdminAccount> _adminAccounts;
        private readonly JwtTokenService _jwtTokenService;

        public AuthService(MongoDbContext dbContext, JwtTokenService jwtTokenService)
        {
            _clients = dbContext.Client;
            _shopAccounts = dbContext.ShopAccount;
            _adminAccounts = dbContext.AdminAccount;
            _jwtTokenService = jwtTokenService;
        }

        public Task<AuthActionResult> RegisterClientAsync(SignUpDto? dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.UserName))
                return Task.FromResult(new AuthActionResult(false, "Không được để trống Tên, Email hoặc Mật khẩu"));

            return RegisterAccountAsync(
                dto.Email,
                dto.Password,
                _clients,
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
                _jwtTokenService.GenerateClientToken,
                AppConstants.Cookies.ClientToken,
                AppConstants.Auth.ClientExpireDays,
                "Đăng ký thành công",
                u => u.Email == dto.Email);
        }

        public Task<AuthActionResult> RegisterShopAsync(ShopSignUpDTo? dto)
        {
            if (dto == null)
                return Task.FromResult(new AuthActionResult(false, "Dữ liệu đăng ký không được để trống"));

            return RegisterAccountAsync(
                dto.Email,
                dto.Password,
                _shopAccounts,
                hash => new ShopAccount
                {
                    id = Guid.NewGuid().ToString(),
                    email = dto.Email,
                    password = hash,
                    shopId = dto.shopId,
                    NgayTaoTaiKhoan = DateTime.Now
                },
                _jwtTokenService.GenerateShopToken,
                AppConstants.Cookies.ShopToken,
                AppConstants.Auth.ShopExpireDays,
                "Đăng ký shop thành công",
                a => a.email == dto.Email);
        }

        public Task<AuthActionResult> CreateAdminAsync(SignUpDto? dto)
        {
            if (dto == null)
                return Task.FromResult(new AuthActionResult(false, "Dữ liệu không được để trống"));

            return RegisterAccountAsync(
                dto.Email,
                dto.Password,
                _adminAccounts,
                hash => new AdminAccount
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = dto.Email,
                    Password = hash
                },
                _jwtTokenService.GenerateAdminToken,
                AppConstants.Cookies.AdminToken,
                AppConstants.Auth.AdminExpireDays,
                "Đăng ký thành công",
                a => a.Email == dto.Email);
        }

        public async Task<AuthActionResult> LoginClientAsync(LoginDto? dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return new AuthActionResult(false, "Không được để Email hoặc Mật khẩu trống");

            var client = await _clients.Find(a => a.Email == dto.Email).FirstOrDefaultAsync();
            if (client == null)
                return new AuthActionResult(false, "Không tìm thấy Email");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, client.PassWord))
                return new AuthActionResult(false, "Sai Email hoặc Mật khẩu");

            return new AuthActionResult(
                true,
                "Đăng nhập thành công",
                _jwtTokenService.GenerateClientToken(client),
                AppConstants.Cookies.ClientToken,
                AppConstants.Auth.ClientExpireDays);
        }

        public async Task<AuthActionResult> LoginWithFirebaseAsync(string idToken)
        {
            FirebaseToken decoded;
            try
            {
                decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            }
            catch (FirebaseAuthException)
            {
                return new AuthActionResult(false, "Token không hợp lệ");
            }

            if (string.IsNullOrEmpty(decoded.Uid))
                return new AuthActionResult(false, "Token không hợp lệ");

            var client = await _clients.Find(a => a.Id == decoded.Uid).FirstOrDefaultAsync();
            if (client == null)
            {
                var email = decoded.Claims.TryGetValue("email", out var emailClaim)
                    ? emailClaim?.ToString() ?? string.Empty
                    : string.Empty;
                var name = decoded.Claims.TryGetValue("name", out var nameClaim)
                    ? nameClaim?.ToString() ?? string.Empty
                    : string.Empty;

                client = new Client
                {
                    Id = decoded.Uid,
                    Email = email,
                    Name = name,
                    Point = 0,
                    Tier = "Bronze",
                    NgayTaoTaiKhoan = DateTime.Now
                };
                await _clients.InsertOneAsync(client);
            }

            return new AuthActionResult(
                true,
                "Đăng nhập thành công",
                _jwtTokenService.GenerateClientToken(client),
                AppConstants.Cookies.ClientToken,
                AppConstants.Auth.ClientExpireDays);
        }

        public Task<AuthActionResult> LoginShopAsync(LoginDto? dto) => VerifyPasswordLoginAsync(
            dto,
            _shopAccounts,
            email => s => s.email == email,
            s => s.password,
            _jwtTokenService.GenerateShopToken,
            AppConstants.Cookies.ShopToken,
            AppConstants.Auth.ShopExpireDays);

        public Task<AuthActionResult> LoginAdminAsync(LoginDto? dto) => VerifyPasswordLoginAsync(
            dto,
            _adminAccounts,
            email => a => a.Email == email,
            a => a.Password,
            _jwtTokenService.GenerateAdminToken,
            AppConstants.Cookies.AdminToken,
            AppConstants.Auth.AdminExpireDays);

        public async Task<AccountProfileResult> GetProfileAsync(string accountType, string? token)
        {
            var userId = _jwtTokenService.ValidateAndGetSubject(token);
            if (userId == null)
                return new AccountProfileResult(false, false, "Token không hợp lệ hoặc đã hết hạn", null);

            switch (accountType)
            {
                case "client":
                {
                    var c = await _clients.Find(a => a.Id == userId).FirstOrDefaultAsync();
                    return c == null
                        ? new AccountProfileResult(false, false, "Tài khoản không tồn tại", null)
                        : new AccountProfileResult(true, false, null, new { c.Id, c.Email, c.Name, c.Point, c.Tier, c.NgayTaoTaiKhoan });
                }
                case "shop":
                {
                    var s = await _shopAccounts.Find(a => a.id == userId).FirstOrDefaultAsync();
                    return s == null
                        ? new AccountProfileResult(false, false, "Tài khoản không tồn tại", null)
                        : new AccountProfileResult(true, false, null, new { s.id, s.email, s.shopId, s.NgayTaoTaiKhoan });
                }
                case "admin":
                {
                    var ad = await _adminAccounts.Find(a => a.Id == userId).FirstOrDefaultAsync();
                    return ad == null
                        ? new AccountProfileResult(false, false, "Tài khoản không tồn tại", null)
                        : new AccountProfileResult(true, false, null, new { ad.Id, ad.Email });
                }
                default:
                    return new AccountProfileResult(false, true, "Loại tài khoản không hợp lệ", null);
            }
        }

        private async Task<AuthActionResult> RegisterAccountAsync<T>(
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
                return new AuthActionResult(false, "Không được để Email hoặc Mật khẩu trống");

            if (password.Length < 6)
                return new AuthActionResult(false, "Mật khẩu phải có ít nhất 6 ký tự");

            if (await collection.Find(emailExistsFilter).AnyAsync())
                return new AuthActionResult(false, "Email đã tồn tại");

            var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: AppConstants.Auth.BcryptWorkFactor);
            var entity = buildEntity(hash);
            await collection.InsertOneAsync(entity);

            return new AuthActionResult(true, successMessage, generateToken(entity), cookieName, cookieDays);
        }

        private static async Task<AuthActionResult> VerifyPasswordLoginAsync<T>(
            LoginDto? dto,
            IMongoCollection<T> collection,
            Func<string, Expression<Func<T, bool>>> buildEmailFilter,
            Func<T, string> getPasswordHash,
            Func<T, string> generateToken,
            string cookieName,
            int expireDays)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return new AuthActionResult(false, "Không được để Email hoặc Mật khẩu trống");

            var account = await collection.Find(buildEmailFilter(dto.Email)).FirstOrDefaultAsync();
            if (account == null)
                return new AuthActionResult(false, "Email Không Tồn Tại");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, getPasswordHash(account)))
                return new AuthActionResult(false, "Sai Mật Khẩu");

            return new AuthActionResult(true, "Đăng Nhập Thành Công", generateToken(account), cookieName, expireDays);
        }
    }
}
