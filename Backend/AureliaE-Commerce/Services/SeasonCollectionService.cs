using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class SeasonCollectionService
    {
        private readonly IMongoCollection<LuxuryCollection> _collections;
        private readonly IMongoCollection<Product> _products;

        public SeasonCollectionService(MongoDbContext dbContext)
        {
            _collections = dbContext.SeasonCollection;
            _products = dbContext.SanPham;
        }

        public async Task<List<LuxuryCollection>> GetAllAsync()
        {
            return await _collections.Find(_ => true).ToListAsync();
        }

        public async Task ReplaceAllAsync(List<LuxuryCollection> collections)
        {
            await _collections.DeleteManyAsync(_ => true);
            await _collections.InsertManyAsync(collections);
        }

        public async Task<object> GetWithProductsAsync(string id)
        {
            var matchedCollections = await _collections.Find(c => c.id == id).ToListAsync();
            var productIds = matchedCollections
                .SelectMany(c => c.products.Select(p => p.id))
                .Distinct()
                .ToList();

            var products = await _products
                .Find(Builders<Product>.Filter.In(p => p.id, productIds))
                .ToListAsync();
            var productMap = products.ToDictionary(p => p.id);

            await _collections.UpdateOneAsync(
                Builders<LuxuryCollection>.Filter.Eq(c => c.id, id),
                Builders<LuxuryCollection>.Update.Inc(c => c.views, 1));

            return matchedCollections.Select(season => new
            {
                Season = season,
                Products = season.products
                    .Select(item => productMap.TryGetValue(item.id, out var product) ? product : null)
                    .Where(product => product != null)
                    .ToList()
            }).ToList();
        }

        public async Task<object> GetStatsAsync()
        {
            var collections = await _collections.Find(_ => true).ToListAsync();
            var totalCollection = collections.Count;
            var totalProduct = collections.Sum(c => c.products.Count);
            var rating = totalCollection > 0 ? collections.Average(c => c.rate) : 0;
            var views = totalCollection > 0 ? collections.Average(c => c.views) : 0;

            return new
            {
                totalCollection,
                totalProduct,
                totalRating = rating,
                totalViews = views
            };
        }

        public async Task AddAsync(LuxuryCollection collection)
        {
            await _collections.InsertOneAsync(collection);
        }

        public async Task<bool> UpdateAsync(LuxuryCollection collection)
        {
            var filter = Builders<LuxuryCollection>.Filter.Eq(c => c.id, collection.id);
            var update = Builders<LuxuryCollection>.Update
                .Set(c => c.slug, collection.slug)
                .Set(c => c.name, collection.name)
                .Set(c => c.slogan, collection.slogan)
                .Set(c => c.description, collection.description)
                .Set(c => c.banner, collection.banner)
                .Set(c => c.seasonalAttributes, collection.seasonalAttributes)
                .Set(c => c.products, collection.products)
                .Set(c => c.rate, collection.rate)
                .Set(c => c.active, collection.active)
                .Set(c => c.views, collection.views);

            var result = await _collections.UpdateOneAsync(filter, update);
            return result.MatchedCount > 0;
        }

        public async Task DeleteAsync(string collectionId)
        {
            await _collections.DeleteOneAsync(c => c.id == collectionId);
        }
    }
}

