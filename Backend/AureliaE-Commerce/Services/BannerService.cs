using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model.Banner;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class BannerService
    {
        private readonly IMongoCollection<MainBanner> _mainBanners;
        private readonly IMongoCollection<StoryBanner> _storyBanners;

        public BannerService(MongoDbContext dbContext)
        {
            _mainBanners = dbContext.MainBanner;
            _storyBanners = dbContext.StoryBanner;
        }

        public async Task<(List<MainBanner> MainBanners, List<StoryBanner> StoryBanners)> GetAllBannersAsync()
        {
            var mainBanners = await _mainBanners.Find(_ => true).ToListAsync();
            var storyBanners = await _storyBanners.Find(_ => true).ToListAsync();
            return (mainBanners, storyBanners);
        }

        public async Task AddMainBannerAsync(MainBanner mainBanner)
        {
            await _mainBanners.InsertOneAsync(mainBanner);
        }

        public async Task AddStoryBannerAsync(StoryBanner story)
        {
            await _storyBanners.InsertOneAsync(story);
        }

        public async Task<bool> AdjustMainBannerAsync(MainBanner mainBanner)
        {
            var filter = Builders<MainBanner>.Filter.Eq(b => b.Id, mainBanner.Id);
            var update = Builders<MainBanner>.Update
                .Set(b => b.LinkUrl, mainBanner.LinkUrl)
                .Set(b => b.MainTitle, mainBanner.MainTitle)
                .Set(b => b.H1, mainBanner.H1)
                .Set(b => b.Pagaraph, mainBanner.Pagaraph)
                .Set(b => b.TextInButton, mainBanner.TextInButton)
                .Set(b => b.Active, mainBanner.Active)
                .Set(b => b.Layout, mainBanner.Layout)
                .Set(b => b.ColorMainTitle, mainBanner.ColorMainTitle)
                .Set(b => b.ColorText, mainBanner.ColorText);

            var result = await _mainBanners.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> AdjustStoryBannerAsync(StoryBanner storyBanner)
        {
            var filter = Builders<StoryBanner>.Filter.Eq(b => b.Id, storyBanner.Id);
            var update = Builders<StoryBanner>.Update
                .Set(b => b.LinkUrl, storyBanner.LinkUrl)
                .Set(b => b.MainTitle, storyBanner.MainTitle)
                .Set(b => b.H1, storyBanner.H1)
                .Set(b => b.Pagaraph, storyBanner.Pagaraph)
                .Set(b => b.Active, storyBanner.Active)
                .Set(b => b.Layout, storyBanner.Layout)
                .Set(b => b.ColorMainTitle, storyBanner.ColorMainTitle)
                .Set(b => b.ColorText, storyBanner.ColorText);

            var result = await _storyBanners.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}

