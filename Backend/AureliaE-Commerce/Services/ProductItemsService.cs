using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class ProductItemsService
    {
        public readonly IMongoCollection<Product> mongoCollection;

        public ProductItemsService(MongoDbContext dbContext)
        {
            mongoCollection = dbContext.SanPham;
        }

        public async Task AddProduct(List<Product> products)
        {
            await mongoCollection.DeleteManyAsync(_ => true);
            await mongoCollection.InsertManyAsync(products);
        }

        public async Task AddProducts(List<Product> products)
        {
            await mongoCollection.InsertManyAsync(products);
        }

        public async Task<List<Product>> GetProduct()
        {
            return await mongoCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<Product>> SearchProduct(string? key)
        {
            var data = await mongoCollection.Find(_ => true).ToListAsync();
            if (string.IsNullOrWhiteSpace(key))
                return data;

            var lower = key.Trim().ToLower();
            var matched = data
                .Where(p => p.name != null && p.name.Trim().ToLower().Contains(lower))
                .ToList();

            if (matched.Count == 0)
            {
                matched = data
                    .Where(p => p.brand != null && p.brand.Trim().ToLower().Contains(lower))
                    .ToList();
            }

            return matched;
        }

        public async Task UpdateQuantityProduct(List<ProductUpdateDto> dtos)
        {
            foreach (var dto in dtos)
            {
                var filter = Builders<Product>.Filter.Eq(p => p.id, dto.productId);
                var update = Builders<Product>.Update
                    .Inc(p => p.stock, -dto.quantity)
                    .Inc(p => p.sold, dto.quantity);
                await mongoCollection.UpdateOneAsync(filter, update);
            }
        }

        public async Task<long> DeleteProduct(string productId)
        {
            var result = await mongoCollection.DeleteManyAsync(p => p.id == productId);
            return result.DeletedCount;
        }

        public async Task<bool> UpdateProduct(Product product)
        {
            var result = await mongoCollection.ReplaceOneAsync(
                p => p.id == product.id,
                product);
            return result.MatchedCount > 0;
        }
    }
}
