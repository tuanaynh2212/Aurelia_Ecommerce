using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class AdminReportService
    {
        private readonly IMongoCollection<Shop> _shops;
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<Coupon> _coupons;
        private readonly IMongoCollection<Product> _products;

        public AdminReportService(MongoDbContext dbContext)
        {
            _shops = dbContext.Shop;
            _clients = dbContext.Client;
            _coupons = dbContext.MaGiamGia;
            _products = dbContext.SanPham;
        }

        public async Task<object> GetRevenueAsync()
        {
            var shops = await _shops.Find(_ => true).ToListAsync();
            var (_, startOfThisMonth, startOfNextMonth, startOfLastMonth) = GetMonthWindow();

            float totalRevenueThisMonth = 0;
            float totalRevenueLastMonth = 0;
            int totalOrdersThisMonth = 0;
            int totalOrdersLastMonth = 0;

            foreach (var shop in shops)
            {
                var orders = (shop.Orders ?? Enumerable.Empty<OrderModel>())
                    .Where(o => o.status != AppConstants.OrderStatus.Cancelled)
                    .ToList();

                var thisMonthOrders = orders
                    .Where(o => o.NgayTaoDon >= startOfThisMonth && o.NgayTaoDon < startOfNextMonth)
                    .ToList();

                var lastMonthOrders = orders
                    .Where(o => o.NgayTaoDon >= startOfLastMonth && o.NgayTaoDon < startOfThisMonth)
                    .ToList();

                totalRevenueThisMonth += thisMonthOrders
                    .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                    .Sum(p => p.price * p.quantity);

                totalRevenueLastMonth += lastMonthOrders
                    .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                    .Sum(p => p.price * p.quantity);

                totalOrdersThisMonth += thisMonthOrders.Count;
                totalOrdersLastMonth += lastMonthOrders.Count;
            }

            return new
            {
                TotalRevenue = Math.Round(totalRevenueThisMonth, 2),
                TotalOrders = totalOrdersThisMonth,
                GrowthRateRevenue = CalculateGrowthRate(totalRevenueThisMonth, totalRevenueLastMonth),
                GrowthRateOrders = CalculateGrowthRate(totalOrdersThisMonth, totalOrdersLastMonth)
            };
        }

        public async Task<object> GetCustomerAndDiscountAsync()
        {
            var (_, startOfThisMonth, startOfNextMonth, startOfLastMonth) = GetMonthWindow();

            var clients = await _clients.Find(_ => true)
                .Project(c => new { c.NgayTaoTaiKhoan })
                .ToListAsync();

            var coupons = await _coupons.Find(_ => true)
                .Project(c => new { c.NgayBatDau })
                .ToListAsync();

            float clientsLastMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfLastMonth && c.NgayTaoTaiKhoan < startOfThisMonth);
            float clientsThisMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfThisMonth && c.NgayTaoTaiKhoan < startOfNextMonth);

            float couponsLastMonth = coupons.Count(c => c.NgayBatDau >= startOfLastMonth && c.NgayBatDau < startOfThisMonth);
            float couponsThisMonth = coupons.Count(c => c.NgayBatDau >= startOfThisMonth && c.NgayBatDau < startOfNextMonth);

            return new
            {
                SoLuongKhachDangKy = clientsThisMonth,
                TyLeKhachHang = CalculateGrowthRate(clientsThisMonth, clientsLastMonth),
                SoLuongCoupon = couponsThisMonth,
                TyLeCoupon = CalculateGrowthRate(couponsThisMonth, couponsLastMonth)
            };
        }

        public async Task<List<ListRevenue>> GetShopMonthlyRevenuesAsync()
        {
            var shops = await _shops.Find(_ => true).ToListAsync();
            var (_, startOfThisMonth, _, _) = GetMonthWindow();

            return shops.Select(shop => new ListRevenue
            {
                ShopName = shop.shopName,
                Revenue = (shop.Orders ?? Enumerable.Empty<OrderModel>())
                    .Where(o => o.status != AppConstants.OrderStatus.Cancelled && o.NgayTaoDon > startOfThisMonth)
                    .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                    .Sum(p => p.price * p.quantity)
            }).ToList();
        }

        public async Task ResetSoldCountsAsync()
        {
            await _products.UpdateManyAsync(_ => true, Builders<Product>.Update.Set(p => p.sold, 0));
            await _shops.UpdateManyAsync(_ => true, Builders<Shop>.Update.Set("products.$[].sold", 0));
        }

        public async Task<object> GetBestSellingProductsAsync()
        {
            var products = await _products.Find(_ => true)
                .Project(p => new { p.sold, p.price, p.name, p.type })
                .ToListAsync();

            return products.OrderByDescending(p => p.sold).ToList();
        }

        public async Task<object> GetShopsInformationAsync()
        {
            var (_, startOfThisMonth, startOfNextMonth, startOfLastMonth) = GetMonthWindow();

            var data = await _shops.Find(_ => true)
                .Project(s => new
                {
                    name = s.shopName,
                    city = s.city,
                    phone = s.phone,
                    rating = s.rating,
                    audience = s.reviews,
                    revenueThisMonth = s.Orders
                        .Where(o => o.NgayTaoDon >= startOfThisMonth
                                 && o.NgayTaoDon < startOfNextMonth
                                 && o.status != AppConstants.OrderStatus.Cancelled)
                        .SelectMany(o => o.product)
                        .Sum(p => (double)p.quantity * p.price),
                    revenueLastMonth = s.Orders
                        .Where(o => o.NgayTaoDon >= startOfLastMonth
                                 && o.NgayTaoDon < startOfThisMonth
                                 && o.status != AppConstants.OrderStatus.Cancelled)
                        .SelectMany(o => o.product)
                        .Sum(p => (double)p.quantity * p.price)
                })
                .ToListAsync();

            return data.Select(s => new
            {
                s.name,
                s.city,
                s.phone,
                s.rating,
                s.audience,
                revenue = s.revenueThisMonth,
                growth = CalculateGrowthRate(s.revenueThisMonth, s.revenueLastMonth)
            }).ToList();
        }

        public async Task<object> GetYearlyReportAsync()
        {
            var currentYear = DateTime.UtcNow.Year;
            var shops = await _shops.Find(_ => true).ToListAsync();

            if (shops == null)
            {
                return new
                {
                    revenue = new List<TotalRevenue>(),
                    stockByType = new List<object>(),
                    AppointMent = new List<object>()
                };
            }

            var revenue = Enumerable.Range(1, 12).Select(month =>
            {
                var startOfMonth = new DateTime(currentYear, month, 1);
                var startOfNextMonth = startOfMonth.AddMonths(1);
                var monthOrders = shops
                    .SelectMany(s => s.Orders ?? Enumerable.Empty<OrderModel>())
                    .Where(o => o.NgayTaoDon >= startOfMonth
                             && o.NgayTaoDon < startOfNextMonth
                             && o.status != AppConstants.OrderStatus.Cancelled)
                    .ToList();

                var monthRevenue = monthOrders
                    .SelectMany(o => o.product ?? Enumerable.Empty<ItemOrder>())
                    .Sum(p => (decimal)p.quantity * (decimal)p.price);

                return new TotalRevenue
                {
                    Thang = month.ToString(),
                    Revenue = monthRevenue,
                    orders = monthOrders.Count
                };
            }).ToList();

            var products = await _products.Find(_ => true)
                .Project(p => new { p.type, p.stock })
                .ToListAsync();

            var totalStock = products.Sum(p => p.stock);
            var stockByType = products
                .GroupBy(p => p.type)
                .Select(g => new
                {
                    Type = g.Key,
                    TotalStock = g.Sum(x => x.stock),
                    Value = totalStock == 0 ? 0 : Math.Round((double)g.Sum(x => x.stock) / totalStock * 100, 2)
                })
                .ToList();

            var appointments = shops
                .Where(s => s.appoiments != null)
                .SelectMany(s => s.appoiments)
                .GroupBy(a => a.Service)
                .Select(g => new
                {
                    service = g.Key,
                    TotalUse = g.Count()
                })
                .OrderByDescending(a => a.TotalUse)
                .ToList();

            return new
            {
                revenue,
                stockByType,
                AppointMent = appointments
            };
        }

        private static (DateTime Now, DateTime StartOfThisMonth, DateTime StartOfNextMonth, DateTime StartOfLastMonth) GetMonthWindow()
        {
            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            return (now, startOfThisMonth, startOfThisMonth.AddMonths(1), startOfThisMonth.AddMonths(-1));
        }

        private static double CalculateGrowthRate(double current, double previous)
        {
            return previous == 0 ? 0 : Math.Round(((current - previous) / previous) * 100, 2);
        }
    }
}

