using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class CouponService
    {
        private readonly IMongoCollection<MaGiamGia> _vouchers;
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<Product> _products;

        public CouponService(MongoDbContext dbContext)
        {
            _vouchers = dbContext.MaGiamGiaVoucher;
            _clients = dbContext.Client;
            _products = dbContext.SanPham;
        }

        public async Task<List<MaGiamGia>> GetAllVouchersAsync()
        {
            return await _vouchers.Find(_ => true).ToListAsync();
        }

        public async Task AddVoucherAsync(MaGiamGia maGiamGia)
        {
            await _vouchers.InsertOneAsync(maGiamGia);
        }

        public async Task AddListVoucherAsync(List<MaGiamGia> maGiamGias)
        {
            await _vouchers.InsertManyAsync(maGiamGias);
        }

        public async Task<bool> AdjustVoucherAsync(MaGiamGia maGiamGia)
        {
            var filter = Builders<MaGiamGia>.Filter.Eq(v => v.id, maGiamGia.id);
            var update = Builders<MaGiamGia>.Update
                .Set(v => v.giaTri, maGiamGia.giaTri)
                .Set(v => v.ngayBatDau, maGiamGia.ngayBatDau)
                .Set(v => v.ngayKetThuc, maGiamGia.ngayKetThuc)
                .Set(v => v.soLuong, maGiamGia.soLuong)
                .Set(v => v.phamViApDung, maGiamGia.phamViApDung)
                .Set(v => v.giaTriDeApDung, maGiamGia.giaTriDeApDung)
                .Set(v => v.typeCoupon, maGiamGia.typeCoupon)
                .Set(v => v.isActive, maGiamGia.isActive)
                .Set(v => v.reuse, maGiamGia.reuse)
                .Set(v => v.code, maGiamGia.code);

            var result = await _vouchers.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task DeleteVoucherAsync(string voucherId)
        {
            await _vouchers.DeleteOneAsync(v => v.id == voucherId);
        }

        public async Task<bool> UpdateStatusAsync(CouponDto dto)
        {
            var filter = Builders<MaGiamGia>.Filter.Eq(v => v.id, dto.id);
            var update = Builders<MaGiamGia>.Update.Set(v => v.isActive, dto.Active);
            var result = await _vouchers.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<List<MaGiamGia>?> SuggestVouchersAsync(OrderModel orderModel, string clientId)
        {
            var customer = await _clients.Find(c => c.Id == clientId).FirstOrDefaultAsync();
            if (customer == null)
                return null;

            var allVouchers = await _vouchers.Find(_ => true).ToListAsync();
            var itemIds = orderModel.product.Select(p => p.Itemid).ToList();
            var products = await _products.Find(Builders<Product>.Filter.In(p => p.id, itemIds)).ToListAsync();

            var productTypes = products.Select(p => p.type).Where(t => !string.IsNullOrEmpty(t)).ToHashSet();
            var productSeasons = products.Select(p => p.season).Where(s => !string.IsNullOrEmpty(s)).ToHashSet();
            var totalOrderValue = orderModel.product.Sum(p => p.price * p.quantity);
            var now = DateTime.Now;

            var eligible = allVouchers
                .Where(v => v.isActive
                    && v.ngayBatDau <= now
                    && v.ngayKetThuc >= now
                    && totalOrderValue >= (v.giaTriDeApDung ?? 0)
                    && CanCustomerUseVoucher(customer, v))
                .ToList();

            var isFirstOrder = customer.DonHangCuaBan == null || customer.DonHangCuaBan.Count == 0;
            var isLoyalCustomer = customer.Point > 10;

            return eligible
                .Where(v => v.phamViApDung switch
                {
                    "First" => isFirstOrder,
                    "Loyal" => isLoyalCustomer,
                    "Category" => v.apDungChoLoai != null && productTypes.Contains(v.apDungChoLoai),
                    "Season" => v.apDungChoMua != null && productSeasons.Contains(v.apDungChoMua),
                    "All" => true,
                    _ => false
                })
                .Distinct()
                .ToList();
        }

        private static bool CanCustomerUseVoucher(Client customer, MaGiamGia voucher)
        {
            if (voucher.reuse == "true")
                return true;

            if (customer.DonHangCuaBan == null)
                return true;

            return !customer.DonHangCuaBan.Any(order =>
                order.voucherUsed?.Any(used => used.code == voucher.code) ?? false);
        }
    }
}

