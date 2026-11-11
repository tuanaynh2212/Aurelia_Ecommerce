using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class ShopService
    {
        public readonly IMongoCollection<Shop> Shoppe;
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<Product> _products;
        private readonly IHubContext<NotifyHub> _hubContext;

        public ShopService(MongoDbContext dbContext, IHubContext<NotifyHub> hubContext)
        {
            Shoppe = dbContext.Shop;
            _clients = dbContext.Client;
            _products = dbContext.SanPham;
            _hubContext = hubContext;
        }

        public async Task AddShop(List<Shop> shops)
        {
            await Shoppe.DeleteManyAsync(_ => true);
            await Shoppe.InsertManyAsync(shops);
        }

        public async Task<List<Shop>> Shops(ShopFindDto dto)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq("products.productId", dto.idProduct),
                Builders<Shop>.Filter.Eq("products.variants.sizes.size", dto.ProductSize));

            return await Shoppe.Find(filter).ToListAsync();
        }

        public async Task<List<Shop>> Shop(string id)
        {
            return await Shoppe.Find(s => s.shopId == id).ToListAsync();
        }

        public async Task AddAppointmentAsync(Appointment appointment, string shopId)
        {
            var filter = Builders<Shop>.Filter.Eq(s => s.shopId, shopId);
            await Shoppe.UpdateOneAsync(filter, Builders<Shop>.Update.Push(s => s.appoiments, appointment));

            var groupName = $"{AppConstants.SignalR.ShopAppointmentGroupPrefix}{appointment.ShopId}";
            var payload = new
            {
                message = $"Có Lịch Hẹn Của Khách  {appointment.CustomerName} Dịch Vụ : {appointment.Service}"
            };

            await _hubContext.Clients.Group(groupName).SendAsync(AppConstants.SignalR.AppointmentBookingMethod, payload);
        }

        public async Task<List<DateTime>?> GetAppointmentCreatedDatesAsync(UploadGetAppointment request)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, request.ShopId),
                Builders<Shop>.Filter.ElemMatch(s => s.appoiments.Select(a => a.CreatedAt), request.NgayTao));

            var shop = await Shoppe.Find(filter).FirstOrDefaultAsync();
            return shop?.appoiments?.Select(a => a.CreatedAt).ToList();
        }

        public async Task<object?> GetSlotsByDateAsync(GetSlotDto dto)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, dto.shopId),
                Builders<Shop>.Filter.ElemMatch(s => s.appoiments, a => a.Date == dto.Date));

            var shop = await Shoppe.Find(filter).FirstOrDefaultAsync();
            if (shop == null)
                return null;

            return shop.appoiments
                .Where(a => a.Date == dto.Date)
                .Select(a => new
                {
                    slot = a.Slot,
                    duration = a.Duration
                })
                .ToList();
        }

        public async Task<(Shop? NearestStore, double Distance, decimal ShippingFee)> AssignOrderToNearestStoreAsync(
            OrderModel orderModel,
            bool estimateOnly)
        {
            var stores = await Shoppe.Find(_ => true).ToListAsync();
            Shop? nearestStore = null;
            double nearestDistance = double.MaxValue;

            foreach (var store in stores)
            {
                if (!HasAllOrderStock(store, orderModel))
                    continue;

                var distance = CalculateDistance(orderModel.lat, orderModel.ion, store.lat, store.lng);
                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearestStore = store;
                }
            }

            if (nearestStore == null)
                return (null, 0, 0);

            var totalAmount = orderModel.product.Sum(item => item.quantity * item.price);
            var shippingFee = CalculateShippingFee(totalAmount, nearestDistance);

            if (!estimateOnly)
            {
                await Shoppe.UpdateOneAsync(
                    Builders<Shop>.Filter.Eq(s => s.shopId, nearestStore.shopId),
                    Builders<Shop>.Update.Push("Orders", orderModel));
            }

            return (nearestStore, nearestDistance, shippingFee);
        }

        public async Task<object?> GetOrderByIdAsync(string orderId)
        {
            var filter = Builders<Shop>.Filter.ElemMatch(s => s.Orders, o => o.orderId == orderId);
            var shop = await Shoppe.Find(filter).FirstOrDefaultAsync();
            if (shop == null)
                return null;

            return new
            {
                shop.shopName,
                shop.address,
                shop.lat,
                ion = shop.lng,
                data = shop.Orders.FirstOrDefault()
            };
        }

        public async Task<object?> GetDashboardMetricsAsync(string shopId)
        {
            var shop = await Shoppe.Find(s => s.shopId == shopId).FirstOrDefaultAsync();
            if (shop == null)
                return null;

            var customers = await _clients.Find(_ => true).ToListAsync();
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var yesterday = today.AddDays(-1);

            var todayAppointments = shop.appoiments.Count(a => a.CreatedAt >= today && a.CreatedAt < tomorrow);
            var todayOrders = shop.Orders.Count(o => o.NgayTaoDon >= today && o.NgayTaoDon < tomorrow);
            var yesterdayOrders = shop.Orders.Count(o => o.NgayTaoDon >= yesterday && o.NgayTaoDon < today);

            var todayRevenue = shop.Orders
                .Where(o => o.NgayTaoDon >= today && o.NgayTaoDon < tomorrow)
                .Sum(o => o.product.Sum(p => p.price));

            var yesterdayRevenue = shop.Orders
                .Where(o => o.NgayTaoDon >= yesterday && o.NgayTaoDon < today)
                .Sum(o => o.product.Sum(p => p.price));

            var newCustomersToday = customers.Count(c => c.NgayTaoTaiKhoan >= today && c.NgayTaoTaiKhoan < tomorrow);
            var pendingAppointments = shop.appoiments.Count(a =>
                a.CreatedAt >= today && a.CreatedAt < tomorrow && a.Status == AppConstants.AppointmentStatus.Pending);

            double revenueGrowthPercent = yesterdayRevenue == 0
                ? 100
                : ((double)(todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
            double orderDelta = yesterdayOrders == 0 ? 0 : (todayOrders - yesterdayOrders);
            double userCreatedDelta = newCustomersToday == 0 ? 0 : (todayOrders - yesterdayOrders);

            return new
            {
                doanhThu = todayRevenue,
                doanhSoPhanTram = revenueGrowthPercent + "%",
                orderHomNay = todayOrders,
                soDon = orderDelta,
                SoLichHen = todayAppointments,
                SoLichCho = pendingAppointments,
                SoUser = newCustomersToday,
                SoLuongTang = userCreatedDelta
            };
        }

        public async Task<object> GetAppointmentsAndOrdersAsync(string shopId)
        {
            var shop = await Shoppe.Find(s => s.shopId == shopId).FirstOrDefaultAsync();
            var listOrder = (shop?.Orders ?? Enumerable.Empty<OrderModel>())
                .OrderByDescending(o => o.NgayTaoDon)
                .ToList();
            var listAppointments = (shop?.appoiments ?? Enumerable.Empty<Appointment>())
                .OrderByDescending(a => a.CreatedAt)
                .ToList();

            return new
            {
                listOrder,
                ListAppoinment = listAppointments
            };
        }

        public async Task<string> UpdateOrderStatusAsync(UpdateStatusDto dto)
        {
            var shopFilter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, dto.ShopId),
                Builders<Shop>.Filter.ElemMatch(s => s.Orders, o => o.orderId == dto.OrderId));

            var clientFilter = Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, o => o.orderId == dto.OrderId);

            await Shoppe.UpdateOneAsync(shopFilter, Builders<Shop>.Update
                .Set("Orders.$.status", dto.status)
                .Set("Orders.$.tracking.UpdateTime", DateTime.Now));

            await _clients.UpdateOneAsync(clientFilter, Builders<Client>.Update
                .Set("DonHangCuaBan.$.status", dto.status)
                .Set("DonHangCuaBan.$.tracking.UpdateTime", DateTime.Now));

            return dto.status switch
            {
                AppConstants.OrderStatus.Confirmed => "Xác Nhận Thành Công!",
                AppConstants.OrderStatus.Packed => "Đóng Gói Thành Công",
                _ => "Bàn Giao Cho Đơn Vị Vận Chuyển Thành Công"
            };
        }

        public async Task<object?> GetShopProductsSummaryAsync(string shopId)
        {
            var shop = await Shoppe.Find(s => s.shopId == shopId).FirstOrDefaultAsync();
            if (shop == null)
                return null;

            var productIds = shop.products.Select(p => p.productId).ToList();
            var products = await _products.Find(Builders<Product>.Filter.In(p => p.id, productIds)).ToListAsync();

            var totalInventoryUnits = shop.products
                .Where(p => p.variants != null)
                .SelectMany(p => p.variants)
                .Where(v => v.sizes != null)
                .SelectMany(v => v.sizes!)
                .Sum(s => s.quantity);

            var shopProductMap = shop.products.ToDictionary(p => p.productId);
            double totalInventoryValue = 0;

            foreach (var prod in products)
            {
                if (!shopProductMap.TryGetValue(prod.id, out var shopProduct) || shopProduct.variants == null)
                    continue;

                var quantity = shopProduct.variants
                    .Where(v => v.sizes != null)
                    .SelectMany(v => v.sizes!)
                    .Sum(s => s.quantity);

                totalInventoryValue += prod.price * quantity;
            }

            return new
            {
                tongSanPham = products.Count,
                tongSoLuongKho = totalInventoryUnits,
                tongGiaTriKho = totalInventoryValue,
                danhSachSanPham = products,
                shopData = shop
            };
        }

        public async Task UploadProductAsync(Product product, string shopId)
        {
            await _products.InsertOneAsync(product);

            var shopProduct = new ProductAtShop
            {
                productId = product.id,
                brand = product.brand,
                name = product.name,
                sold = product.sold,
                variants = product.variants ?? []
            };

            await Shoppe.UpdateOneAsync(
                Builders<Shop>.Filter.Eq(s => s.shopId, shopId),
                Builders<Shop>.Update.Push(s => s.products, shopProduct));
        }

        public async Task<bool> UpdateShopProductAsync(Product product, string shopId)
        {
            await _products.UpdateOneAsync(
                Builders<Product>.Filter.Eq(p => p.id, product.id),
                Builders<Product>.Update
                    .Set(p => p.name, product.name)
                    .Set(p => p.type, product.type)
                    .Set(p => p.subcategory, product.subcategory)
                    .Set(p => p.brand, product.brand)
                    .Set(p => p.origin, product.origin)
                    .Set(p => p.price, product.price)
                    .Set(p => p.description, product.description)
                    .Set(p => p.rating, product.rating)
                    .Set(p => p.stock, product.stock)
                    .Set(p => p.updatedAt, DateTime.UtcNow)
                    .Set(p => p.thumbnail, product.thumbnail)
                    .Set(p => p.images, product.images)
                    .Set(p => p.sold, product.sold)
                    .Set(p => p.variants, product.variants));

            var updatedShopProduct = new ProductAtShop
            {
                productId = product.id,
                name = product.name,
                brand = product.brand,
                variants = product.variants ?? [],
                sold = product.sold
            };

            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, shopId),
                Builders<Shop>.Filter.ElemMatch(s => s.products, p => p.productId == product.id));

            var result = await Shoppe.UpdateOneAsync(filter, Builders<Shop>.Update.Set("products.$", updatedShopProduct));
            return result.ModifiedCount > 0;
        }

        public async Task<bool> PostNotificationAsync(Notifycation notification)
        {
            var result = await Shoppe.UpdateOneAsync(
                Builders<Shop>.Filter.Eq(s => s.shopId, notification.shopId),
                Builders<Shop>.Update.Push(s => s.Notifycation, notification));

            if (result.MatchedCount == 0)
                return false;

            await _hubContext.Clients.Group(notification.shopId)
                .SendAsync(AppConstants.SignalR.ReceiveNotificationMethod, notification);

            return true;
        }

        public async Task<List<Notifycation>> GetNotificationsAsync(string shopId)
        {
            var shop = await Shoppe.Find(s => s.shopId == shopId).FirstOrDefaultAsync();
            return shop?.Notifycation?.ToList() ?? [];
        }

        public async Task MarkNotificationCheckedAsync(AddCheckDto dto)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, dto.shop_ID),
                Builders<Shop>.Filter.ElemMatch(s => s.Notifycation, n => n.id == dto.idNotifycation));

            await Shoppe.UpdateOneAsync(filter, Builders<Shop>.Update.Set("Notifycation.$.isChecked", true));
        }

        public async Task<object> GetCustomerStatsAsync()
        {
            var customers = await _clients.Find(_ => true).ToListAsync();
            var totalCustomer = customers.Count;
            var totalRevenue = customers
                .SelectMany(c => c.DonHangCuaBan ?? Enumerable.Empty<OrderModel>())
                .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                .Sum(item => item.quantity * item.price);

            double averageSpend = totalCustomer > 0 ? totalRevenue / (double)totalCustomer : 0;

            return new
            {
                listCustomer = customers,
                totalCustomer,
                totalDoanhThu = totalRevenue,
                averageChiTieuKhachHang = averageSpend
            };
        }

        private static bool HasAllOrderStock(Shop store, OrderModel order)
        {
            return order.product.All(orderItem =>
                store.products.Any(p =>
                    p.productId == orderItem.Itemid &&
                    p.variants != null &&
                    p.variants.Any(v =>
                        v.sizes != null &&
                        v.sizes.Any(s => s.size == orderItem.size && s.quantity >= orderItem.quantity))));
        }

        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double earthRadiusKm = 6371;
            double dLat = (lon2 - lon1) * Math.PI / 180;
            double dLon = (lat2 - lat1) * Math.PI / 180;
            var latCus = lat1 * Math.PI / 180;
            var latShop = lat2 * Math.PI / 180;
            var haversine = Math.Pow(Math.Sin(dLat / 2), 2)
                          + Math.Cos(latCus) * Math.Cos(latShop) * Math.Pow(Math.Sin(dLon / 2), 2);
            double centralAngle = 2 * Math.Atan2(Math.Sqrt(haversine), Math.Sqrt(1 - haversine));
            return earthRadiusKm * centralAngle;
        }

        private static decimal CalculateShippingFee(float totalAmount, double distanceKm)
        {
            if (totalAmount > 1_000_000_000 || distanceKm <= 5) return 0;
            if (distanceKm <= 100) return 25000;
            if (distanceKm <= 200) return 35000;
            if (distanceKm <= 1000) return 45000;
            return 55000;
        }
    }
}
