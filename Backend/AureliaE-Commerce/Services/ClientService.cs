using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using PayPalCheckoutSdk.Orders;

namespace AureliaE_Commerce.Services
{
    public class ClientService
    {
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<Shop> _shops;
        private readonly IMongoCollection<Product> _products;
        private readonly IMongoCollection<MaGiamGia> _vouchers;
        private readonly IHubContext<NotifyHub> _hubContext;

        public ClientService(MongoDbContext dbContext, IHubContext<NotifyHub> hubContext)
        {
            _clients = dbContext.Client;
            _shops = dbContext.Shop;
            _products = dbContext.SanPham;
            _vouchers = dbContext.MaGiamGiaVoucher;
            _hubContext = hubContext;
        }

        public async Task<bool> AddFavouriteAsync(string userId, Product product)
        {
            if (product == null || string.IsNullOrWhiteSpace(product.id)) return false;

            var client = await _clients.Find(c => c.Id == userId).FirstOrDefaultAsync();
            if (client == null) return false;

            if (client.SanPhamYeuThich == null)
            {
                var initResult = await _clients.UpdateOneAsync(
                    Builders<Client>.Filter.Eq(c => c.Id, userId),
                    Builders<Client>.Update.Set(c => c.SanPhamYeuThich, new List<Product> { product }));
                return initResult.ModifiedCount > 0;
            }

            if (client.SanPhamYeuThich.Any(p => p != null && p.id == product.id))
            {
                return true;
            }

            var result = await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.Push(c => c.SanPhamYeuThich, product));

            return result.ModifiedCount > 0;
        }

        public async Task<bool> RemoveFavouriteAsync(string userId, string productId)
        {
            if (string.IsNullOrWhiteSpace(productId)) return false;

            var client = await _clients.Find(c => c.Id == userId).FirstOrDefaultAsync();
            if (client == null) return false;

            if (client.SanPhamYeuThich == null || !client.SanPhamYeuThich.Any(p => p != null && p.id == productId))
            {
                return true;
            }

            var result = await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.PullFilter(c => c.SanPhamYeuThich, p => p.id == productId));

            return result.ModifiedCount > 0;
        }

        public async Task AddCartItemsAsync(string userId, List<ItemOrder> products)
        {
            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.PushEach(c => c.GioHangCuaBan, products));
        }

        public async Task ClearCartAsync(string userId)
        {
            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.Set(c => c.GioHangCuaBan, new List<ItemOrder>()));
        }

        public async Task<Client?> GetByIdAsync(string userId)
        {
            return await _clients.Find(c => c.Id == userId).FirstOrDefaultAsync();
        }

        public async Task<bool> AddOrderAsync(string userId, OrderModel order, string shopId)
        {
            var clientFilter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var orderPushResult = await _clients.UpdateOneAsync(
                clientFilter,
                Builders<Client>.Update.Push("DonHangCuaBan", order));

            var orderTotal = order.product.Sum(item => item.price * item.quantity);
            var points = CalculateOrderPoints(orderTotal);
            await _clients.UpdateOneAsync(clientFilter, Builders<Client>.Update.Set(c => c.Point, points));

            var voucherCode = order.voucherUsed != null && order.voucherUsed.Count > 0
                ? order.voucherUsed[0].code
                : string.Empty;

            await _vouchers.UpdateOneAsync(
                Builders<MaGiamGia>.Filter.Eq(v => v.code, voucherCode),
                Builders<MaGiamGia>.Update.Inc(v => v.soLuong, -1));

            var firstProductId = order.product.Select(item => item.Itemid).FirstOrDefault();
            var soldQuantity = order.product.Where(item => item.Itemid == firstProductId).Sum(item => item.quantity);

            var shopProductFilter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, shopId),
                Builders<Shop>.Filter.ElemMatch(s => s.products, p => p.productId == firstProductId));

            await _shops.UpdateOneAsync(shopProductFilter, Builders<Shop>.Update.Inc("products.$.sold", soldQuantity));

            var shopGroup = $"{AppConstants.SignalR.ShopOrderGroupPrefix}{shopId}";
            var notifyPayload = new { message = $"Đơn hàng mới #{order.orderId} từ {order.name}" };
            await _hubContext.Clients.Group(shopGroup).SendAsync(AppConstants.SignalR.NotificationOrderMethod, notifyPayload);

            return orderPushResult.ModifiedCount > 0;
        }

        public async Task<string?> GetLatestOrderDateAsync(string userId)
        {
            var client = await GetByIdAsync(userId);
            if (client?.DonHangCuaBan == null || client.DonHangCuaBan.Count == 0)
                return null;

            return client.DonHangCuaBan
                .SelectMany(o => o.product)
                .OrderByDescending(item => item.dateBuy)
                .FirstOrDefault()?.dateBuy;
        }

        public async Task<(int Count, float TotalAmount)?> GetOrderSummaryAsync(string userId)
        {
            var client = await GetByIdAsync(userId);
            if (client == null)
                return null;

            var validOrders = (client.DonHangCuaBan ?? Enumerable.Empty<OrderModel>())
                .Where(o => o.status != AppConstants.OrderStatus.Cancelled)
                .ToList();

            var totalAmount = validOrders
                .SelectMany(o => o.product)
                .Sum(item => item.quantity * item.price);

            return (validOrders.Count, totalAmount);
        }

        public async Task UpdateMeasureAsync(string userId, Measure measure)
        {
            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.Set("SoDoNgDUng", measure));
        }

        public async Task AddAppointmentAsync(string userId, ClientAppointment appointment)
        {
            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.Push("LichSuCuocHen", appointment));
        }

        public async Task SaveAddressAsync(string userId, ThongTinCaNhan address)
        {
            await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.Push(c => c.ThongTinDatHang, address));
        }

        public async Task<bool> DeleteAddressAsync(string userId, ThongTinCaNhan address)
        {
            var result = await _clients.UpdateOneAsync(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Update.PullFilter(
                    c => c.ThongTinDatHang,
                    entry => entry.hoVaTen == address.hoVaTen
                          && entry.diaChi == address.diaChi
                          && entry.email == address.email
                          && entry.soDT == address.soDT));

            return result.ModifiedCount > 0;
        }

        public async Task<(bool Success, string? ErrorMessage, string? OrderId, string? Amount)> VerifyPayPalPaymentAsync(PaypalDto paypalDto)
        {
            var payPalClient = PayPalClient.Client();
            var request = new OrdersGetRequest(paypalDto.orderId);
            var response = await payPalClient.Execute(request);
            var order = response.Result<Order>();

            if (order.Status != "COMPLETED")
                return (false, "Thanh toán thất bại", null, null);

            var totalAmount = paypalDto.order.product.Sum(item => item.price * item.quantity);
            var paidAmount = order.PurchaseUnits[0].AmountWithBreakdown.Value;

            if (paidAmount != totalAmount.ToString())
                return (false, "Số tiền thanh toán không khớp", null, null);

            return (true, null, order.Id, paidAmount);
        }

        public async Task<Client?> UpdateProfileAsync(string userId, UpdateProfileCustomer profile)
        {
            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var existing = await _clients.Find(filter).FirstOrDefaultAsync();
            if (existing == null)
                return null;

            var name = profile.name ?? existing.Name;
            var email = profile.email ?? existing.Email;
            var phone = profile.phone ?? existing.SoDt;
            var address = profile.address ?? existing.DiaChi;
            var avatar = profile.avatar ?? existing.Avatar;

            var update = Builders<Client>.Update
                .Set(c => c.Name, name)
                .Set(c => c.Email, email)
                .Set(c => c.SoDt, phone)
                .Set(c => c.DiaChi, address)
                .Set(c => c.Avatar, avatar);

            await _clients.UpdateOneAsync(filter, update);

            existing.Name = name;
            existing.Email = email;
            existing.SoDt = phone;
            existing.DiaChi = address;
            existing.Avatar = avatar;
            return existing;
        }

        public async Task UpdateTierAsync(string userId)
        {
            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var client = await _clients.Find(filter).FirstOrDefaultAsync();
            if (client == null)
                return;

            var tier = ResolveTier(client.Point);
            await _clients.UpdateOneAsync(filter, Builders<Client>.Update.Set(c => c.Tier, tier));

            var benefit = ResolveBenefit(tier);
            if (benefit != null)
                await _clients.UpdateOneAsync(filter, Builders<Client>.Update.Set(c => c.Benefits, benefit));
        }

        public async Task CancelOrderAsync(string userId, string orderId)
        {
            var clientOrderFilter = Builders<Client>.Filter.And(
                Builders<Client>.Filter.Eq(c => c.Id, userId),
                Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, d => d.orderId == orderId));

            await _clients.UpdateOneAsync(
                clientOrderFilter,
                Builders<Client>.Update.Set("DonHangCuaBan.$.status", AppConstants.OrderStatus.Cancelled));

            var shopOrderFilter = Builders<Shop>.Filter.ElemMatch(s => s.Orders, o => o.orderId == orderId);
            await _shops.UpdateOneAsync(
                shopOrderFilter,
                Builders<Shop>.Update.Set("Orders.$.status", AppConstants.OrderStatus.Cancelled));

            var client = await _clients.Find(clientOrderFilter).FirstOrDefaultAsync();
            var itemToRestore = client?.DonHangCuaBan?
                .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                .FirstOrDefault();

            if (itemToRestore == null)
                return;

            var productFilter = Builders<Product>.Filter.And(
                Builders<Product>.Filter.Eq(p => p.id, itemToRestore.Itemid),
                Builders<Product>.Filter.Eq("variants.color", itemToRestore.color),
                Builders<Product>.Filter.Eq("variants.sizes.size", itemToRestore.size));

            var productUpdate = Builders<Product>.Update.Inc("variants.$[v].sizes.$[s].quantity", itemToRestore.quantity);
            var updateOptions = new UpdateOptions
            {
                ArrayFilters = new List<ArrayFilterDefinition>
                {
                    new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("v.color", itemToRestore.color)),
                    new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("s.size", itemToRestore.size))
                }
            };

            await _products.UpdateOneAsync(productFilter, productUpdate, updateOptions);
        }

        private static int CalculateOrderPoints(float value) => value switch
        {
            <= 100_000_000 => 100,
            <= 500_000_000 => 500,
            <= 1_000_000_000 => 1000,
            _ => 2000
        };

        private static string ResolveTier(int points) => points switch
        {
            <= 1000 => "Bronze",
            <= 5000 => "Silver",
            <= 10000 => "Gold",
            <= 20000 => "Diamond",
            _ => "Royal"
        };

        private static benefit? ResolveBenefit(string tier) => tier switch
        {
            "Bronze" => new benefit { name = "Ưu đãi sinh nhật 3%", freeShipping = false, value = 3 },
            "Silver" => new benefit { name = "Miễn phí vận chuyển đơn đầu tiên + Ưu đãi sinh nhật 5%", freeShipping = true, value = 5 },
            "Gold" => new benefit { name = "Giảm 10% cho tất cả sản phẩm + Ưu tiên hỗ trợ khách hàng", freeShipping = true, value = 10 },
            "Diamond" => new benefit { name = "Giảm 15% + Quà tri ân mỗi quý", freeShipping = true, value = 15 },
            "Royal" => new benefit { name = "Giảm 20% + Ưu đãi sự kiện VIP + Hỗ trợ riêng 24/7", freeShipping = true, value = 20 },
            "Royal Plus" => new benefit { name = "Giảm 30% + Quà tặng độc quyền + Trải nghiệm cao cấp", freeShipping = true, value = 30 },
            _ => null
        };
    }
}
