using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class AiSizeService
    {
        private readonly IMongoCollection<Client> _clients;

        private enum Size
        {
            XS,
            S,
            M,
            L,
            XL
        }

        private sealed class SizeRule
        {
            public Size Size { get; init; }
            public double Bust { get; init; }
            public double Waist { get; init; }
            public double Hip { get; init; }
            public double Shoulder { get; init; }
        }

        private static readonly List<SizeRule> SizeChart =
        [
            new() { Size = Size.XS, Bust = 78, Waist = 62, Hip = 84, Shoulder = 35 },
            new() { Size = Size.S,  Bust = 82, Waist = 66, Hip = 88, Shoulder = 36.5 },
            new() { Size = Size.M,  Bust = 86, Waist = 70, Hip = 92, Shoulder = 37.5 },
            new() { Size = Size.L,  Bust = 90, Waist = 74, Hip = 96, Shoulder = 38.5 },
            new() { Size = Size.XL, Bust = 94, Waist = 78, Hip = 100, Shoulder = 39.5 }
        ];

        public AiSizeService(MongoDbContext dbContext)
        {
            _clients = dbContext.Client;
        }

        public async Task<(bool HasMeasurements, string? SizeName, string? Note, string Message)> GetAdviceSizeAsync(
            string userId,
            ProductGetAdviceFromUserDto dto)
        {
            var client = await _clients.Find(c => c.Id == userId).FirstOrDefaultAsync();
            if (client?.SoDoNgDUng == null)
                return (false, null, null, "Người dùng chưa có số đo");

            var measurements = client.SoDoNgDUng;
            if (!double.TryParse(measurements.nguc, out var bust)
                || !double.TryParse(measurements.eo, out var waist)
                || !double.TryParse(measurements.hong, out var hip)
                || !double.TryParse(measurements.vai, out var shoulder))
            {
                return (false, null, null, "Người dùng chưa có số đo");
            }

            var productType = ResolveProductType(dto);
            if (productType == null)
                return (true, null, null, "Không thể ước tính size cho sản phẩm này");

            var (size, note) = CalculateFemaleSize(bust, waist, hip, shoulder, productType);
            return (true, size.ToString(), note, $"AI gợi ý size: {size}");
        }

        private static string? ResolveProductType(ProductGetAdviceFromUserDto dto)
        {
            if (dto.subCategory?.Contains("dress") == true) return "dress";
            if (dto.subCategory?.Contains("top") == true) return "top";
            if (dto.type?.Contains("top") == true) return "top";
            if (dto.type?.Contains("dress") == true) return "dress";
            return null;
        }

        private static (Size size, string note) CalculateFemaleSize(
            double bust,
            double waist,
            double hip,
            double shoulder,
            string productType)
        {
            const double safeGap = 3.0;
            var candidates = new List<(Size size, double score, string note)>();

            foreach (var rule in SizeChart)
            {
                if (rule.Bust < bust - safeGap) continue;
                if (productType == "dress" && rule.Hip < hip - safeGap) continue;

                double score;
                string note;

                if (productType == "top")
                {
                    score = Math.Abs(rule.Bust - bust) * 0.6 + Math.Abs(rule.Shoulder - shoulder) * 0.4;
                    note = bust > rule.Bust
                        ? "Ưu tiên theo vòng ngực, có thể hơi rộng vai"
                        : "Form vừa ngực và vai";
                }
                else
                {
                    score = Math.Abs(rule.Bust - bust) * 0.4
                          + Math.Abs(rule.Hip - hip) * 0.35
                          + Math.Abs(rule.Waist - waist) * 0.25;

                    if (hip > bust + 4)
                        note = "Dáng hông lớn, chọn theo vòng hông, eo có thể rộng";
                    else if (bust > hip + 4)
                        note = "Dáng ngực lớn, chọn theo vòng ngực";
                    else
                        note = "Form cân đối";
                }

                candidates.Add((rule.Size, score, note));
            }

            if (candidates.Count > 0)
                return candidates.OrderBy(c => c.score).Select(c => (c.size, c.note)).First();

            return (SizeChart.Max(s => s.Size), "Kích thước lớn nhất có thể");
        }
    }
}

