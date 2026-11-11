namespace AureliaE_Commerce.Constants
{
    public static class AppConstants
    {
        public static class EnvKeys
        {
            public const string MongoUri = "MONGODB_URI";
            public const string DatabaseName = "DataBaseName";
            public const string JwtKey = "JWT_KEY";
            public const string FirebaseCredentialsJson = "FIREBASE_CREDENTIALS_JSON";
            public const string PayPalClientId = "PAYPAL_CLIENT_ID";
            public const string PayPalSecret = "PAYPAL_SECRET";
            public const string MailAddress = "Mail";
            public const string MailPassword = "PassEmail";
            public const string ResetPasswordBaseUrl = "RESET_PASSWORD_BASE_URL";
        }

        public static class ConfigKeys
        {
            public const string MongoSection = "MongoDbSettings";
            public const string MongoConnectionString = "MongoDbSettings:ConnectionString";
            public const string JwtKey = "Jwt:Key";
        }

        public static class Collections
        {
            public const string Client = "KhachHang";
            public const string Product = "SanPham";
            public const string Shop = "Shop";
            public const string ShopAccount = "ShopAccount";
            public const string AdminAccount = "AdminAccount";
            public const string Coupon = "MaGiamGia";
            public const string MainBanner = "BannerHomePage";
            public const string StoryBanner = "StoryBanner";
            public const string Voucher = "Voucher";
            public const string SeasonCollection = "SeasonCollection";
            public const string ResetPasswordHash = "ResetPassWordHass";
        }

        public static class Cookies
        {
            public const string ClientToken = "access_token_client";
            public const string ShopToken = "access_token_shop";
            public const string AdminToken = "access_token_admin";
            public const string FallbackToken = "access_token_user";
            public const string SignalRQueryToken = "access_token";
        }

        public static class Auth
        {
            public const int ClientExpireDays = 7;
            public const int ShopExpireDays = 3;
            public const int AdminExpireDays = 7;
            public const int BcryptWorkFactor = 12;
            public const string FirebaseScope = "https://www.googleapis.com/auth/cloud-platform";
        }

        public static class OrderStatus
        {
            public const string Cancelled = "Đã Hủy";
            public const string Confirmed = "Xác Nhận";
            public const string Packed = "Đóng gói";
        }

        public static class AppointmentStatus
        {
            public const string Pending = "Pending";
        }

        public static class Email
        {
            public const string SmtpHost = "smtp.gmail.com";
            public const int SmtpPort = 587;
            public const string SenderName = "Aurelia E-Commerce";
            public const string SenderAddress = "no-reply@aureliaecommerce.com";
            public const string ResetSubject = "Đặt lại mật khẩu";
            public const string DefaultResetBaseUrl = "https://localhost:5173/reset-password";
            public const int ResetTokenExpireHours = 1;
        }

        public static class SignalR
        {
            public const string ShopOrderGroupPrefix = "Shop_";
            public const string ShopAppointmentGroupPrefix = "Shop_Appointment";
            public const string NotificationOrderMethod = "NotificationOrder";
            public const string AppointmentBookingMethod = "AppointmentBooking";
            public const string ReceiveNotificationMethod = "ReceiveNotification";
        }

        public static class Cors
        {
            public const string PolicyName = "AllowFrontEnd";

            public static readonly string[] AllowedOrigins =
            {
                "https://aureliashop.vercel.app",
                "https://localhost:4121"
            };
        }

        public static class Api
        {
            public const string SwaggerTitle = "Aurelia E-Commerce API";
            public const string SwaggerVersion = "v1";
            public const string SwaggerEndpoint = "/swagger/v1/swagger.json";
            public const string NotifyHubRoute = "/notifyHub";
        }
    }
}

