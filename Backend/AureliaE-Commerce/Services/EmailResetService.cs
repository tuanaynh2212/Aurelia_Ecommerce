using System.Security.Cryptography;
using System.Text;
using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class EmailResetService
    {
        private readonly IMongoCollection<ResetPassWordHass> _resetTokens;
        private readonly IMongoCollection<Client> _clients;

        public EmailResetService(MongoDbContext dbContext)
        {
            _resetTokens = dbContext.ResetPassWordHass;
            _clients = dbContext.Client;
        }

        public async Task<bool> SendPasswordResetAsync(string email)
        {
            var user = await _clients.Find(c => c.Email == email).FirstOrDefaultAsync();
            if (user == null)
                return false;

            var token = GenerateRandomToken();
            var resetEntry = new ResetPassWordHass
            {
                idUser = user.Id,
                email = email,
                tokenHash = HashToken(token),
                tokenExpiration = DateTime.UtcNow.AddHours(AppConstants.Email.ResetTokenExpireHours)
            };

            await _resetTokens.InsertOneAsync(resetEntry);

            var baseUrl = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.ResetPasswordBaseUrl)
                ?? AppConstants.Email.DefaultResetBaseUrl;
            var resetLink = $"{baseUrl}?token={token}&email={email}";

            await SendEmailAsync(email, resetLink);
            return true;
        }

        public async Task<(bool Success, string Message)> ChangePasswordAsync(ChangePassWordRequestDto request)
        {
            var filter = Builders<ResetPassWordHass>.Filter.Eq(r => r.email, request.email);
            var resetEntry = await _resetTokens.Find(filter).FirstOrDefaultAsync();

            if (resetEntry == null || resetEntry.tokenExpiration < DateTime.UtcNow)
                return (false, "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");

            if (HashToken(request.token) != resetEntry.tokenHash)
                return (false, "Liên kết đặt lại mật khẩu không hợp lệ.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(
                request.newPassword,
                workFactor: AppConstants.Auth.BcryptWorkFactor);

            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, resetEntry.idUser),
                Builders<Client>.Update.Set(c => c.PassWord, passwordHash));

            await _resetTokens.DeleteOneAsync(filter);
            await _resetTokens.DeleteManyAsync(
                Builders<ResetPassWordHass>.Filter.Lt(r => r.tokenExpiration, DateTime.UtcNow));

            return (true, "Mật khẩu đã được thay đổi thành công.");
        }

        private static async Task SendEmailAsync(string recipientEmail, string resetLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(AppConstants.Email.SenderName, AppConstants.Email.SenderAddress));
            message.To.Add(new MailboxAddress(string.Empty, recipientEmail));
            message.Subject = AppConstants.Email.ResetSubject;
            message.Body = new TextPart("html")
            {
                Text = $"<p>Để đặt lại mật khẩu, vui lòng nhấp vào liên kết sau:</p><p><a href='{resetLink}'>Đặt lại mật khẩu</a></p><p>Liên kết này sẽ hết hạn trong 1 giờ.</p>"
            };

            var mailAddress = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.MailAddress);
            var mailPassword = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.MailPassword);

            using var smtpClient = new SmtpClient();
            await smtpClient.ConnectAsync(
                AppConstants.Email.SmtpHost,
                AppConstants.Email.SmtpPort,
                SecureSocketOptions.StartTls);
            await smtpClient.AuthenticateAsync(mailAddress, mailPassword);
            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }

        private static string GenerateRandomToken()
        {
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            return token.Replace("=", "").Replace("+", "").Replace("/", "");
        }

        private static string HashToken(string input)
        {
            using var sha = SHA256.Create();
            return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(input)));
        }
    }
}
