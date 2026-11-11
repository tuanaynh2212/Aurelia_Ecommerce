using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Banner;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Model.Shop;
using MongoDB.Driver;

namespace AureliaE_Commerce.Context
{
    public class MongoDbContext
    {
        public readonly IMongoDatabase mongoDatabase;

        public MongoDbContext(IMongoDatabase database)
        {
            mongoDatabase = database;
        }

        public IMongoCollection<Client> Client => mongoDatabase.GetCollection<Client>(AppConstants.Collections.Client);
        public IMongoCollection<Product> SanPham => mongoDatabase.GetCollection<Product>(AppConstants.Collections.Product);
        public IMongoCollection<Shop> Shop => mongoDatabase.GetCollection<Shop>(AppConstants.Collections.Shop);
        public IMongoCollection<ShopAccount> ShopAccount => mongoDatabase.GetCollection<ShopAccount>(AppConstants.Collections.ShopAccount);
        public IMongoCollection<AdminAccount> AdminAccount => mongoDatabase.GetCollection<AdminAccount>(AppConstants.Collections.AdminAccount);
        public IMongoCollection<Coupon> MaGiamGia => mongoDatabase.GetCollection<Coupon>(AppConstants.Collections.Coupon);
        public IMongoCollection<MainBanner> MainBanner => mongoDatabase.GetCollection<MainBanner>(AppConstants.Collections.MainBanner);
        public IMongoCollection<StoryBanner> StoryBanner => mongoDatabase.GetCollection<StoryBanner>(AppConstants.Collections.StoryBanner);
        public IMongoCollection<MaGiamGia> MaGiamGiaVoucher => mongoDatabase.GetCollection<MaGiamGia>(AppConstants.Collections.Voucher);
        public IMongoCollection<LuxuryCollection> SeasonCollection => mongoDatabase.GetCollection<LuxuryCollection>(AppConstants.Collections.SeasonCollection);
        public IMongoCollection<ResetPassWordHass> ResetPassWordHass => mongoDatabase.GetCollection<ResetPassWordHass>(AppConstants.Collections.ResetPasswordHash);
    }
}
