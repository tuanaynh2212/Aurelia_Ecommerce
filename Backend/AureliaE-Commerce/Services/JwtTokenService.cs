using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using Microsoft.IdentityModel.Tokens;

namespace AureliaE_Commerce.Services
{
    public class JwtTokenService
    {
        private readonly IConfiguration _configuration;

        public JwtTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private byte[] GetSigningKeyBytes()
        {
            var key = _configuration[AppConstants.ConfigKeys.JwtKey]
                ?? throw new InvalidOperationException("Thiếu cấu hình Jwt:Key");
            return Encoding.UTF8.GetBytes(key);
        }

        public string GenerateToken(IEnumerable<Claim> claims, int expireDays)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(expireDays),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(GetSigningKeyBytes()),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.WriteToken(tokenHandler.CreateToken(descriptor));
        }

        public string GenerateClientToken(Client client) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, client.Id),
            new Claim(JwtRegisteredClaimNames.Email, client.Email),
            new Claim(ClaimTypes.Name, client.Name)
        }, AppConstants.Auth.ClientExpireDays);

        public string GenerateShopToken(ShopAccount shop) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, shop.id),
            new Claim(JwtRegisteredClaimNames.Email, shop.email),
            new Claim("shopId", shop.shopId)
        }, AppConstants.Auth.ShopExpireDays);

        public string GenerateAdminToken(AdminAccount admin) => GenerateToken(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, admin.Id),
            new Claim(JwtRegisteredClaimNames.Email, admin.Email)
        }, AppConstants.Auth.AdminExpireDays);

        public string? ValidateAndGetSubject(string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            try
            {
                new JwtSecurityTokenHandler().ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(GetSigningKeyBytes()),
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

        public string? GetSubjectFromRequestCookie(HttpRequest request, string accountType = "user")
        {
            var cookieName = ResolveCookieName(accountType) ?? AppConstants.Cookies.FallbackToken;
            if (!request.Cookies.TryGetValue(cookieName, out var token))
                return null;

            return ValidateAndGetSubject(token);
        }

        public static string? ResolveCookieName(string accountType) => accountType switch
        {
            "client" => AppConstants.Cookies.ClientToken,
            "user" => AppConstants.Cookies.ClientToken,
            "shop" => AppConstants.Cookies.ShopToken,
            "admin" => AppConstants.Cookies.AdminToken,
            _ => null
        };

        public static CookieOptions CreateAuthCookieOptions(int? expireDays = null)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };

            if (expireDays.HasValue)
                options.Expires = DateTimeOffset.UtcNow.AddDays(expireDays.Value);

            return options;
        }
    }
}

