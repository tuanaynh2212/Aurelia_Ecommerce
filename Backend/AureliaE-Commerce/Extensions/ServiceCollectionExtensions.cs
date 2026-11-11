using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

namespace AureliaE_Commerce.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMongoServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var mongoUri = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.MongoUri)
                ?? configuration[AppConstants.ConfigKeys.MongoConnectionString];
            var dbName = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.DatabaseName);

            if (string.IsNullOrWhiteSpace(mongoUri))
                throw new InvalidOperationException($"Missing {AppConstants.EnvKeys.MongoUri} environment variable");

            if (string.IsNullOrWhiteSpace(dbName))
                throw new InvalidOperationException($"Missing {AppConstants.EnvKeys.DatabaseName} environment variable");

            configuration[AppConstants.ConfigKeys.MongoConnectionString] = mongoUri;
            services.Configure<MongoDbSettings>(configuration.GetSection(AppConstants.ConfigKeys.MongoSection));
            services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoUri));
            services.AddSingleton<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(dbName));
            services.AddSingleton<MongoDbContext>();

            return services;
        }

        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddSingleton<JwtTokenService>();
            services.AddSingleton<AuthService>();
            services.AddSingleton<ProductItemsService>();
            services.AddSingleton<ShopService>();
            services.AddSingleton<ClientService>();
            services.AddSingleton<AdminReportService>();
            services.AddSingleton<BannerService>();
            services.AddSingleton<CouponService>();
            services.AddSingleton<SeasonCollectionService>();
            services.AddSingleton<EmailResetService>();
            services.AddSingleton<AiSizeService>();
            services.AddControllers();
            services.AddSignalR();

            return services;
        }

        public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(AppConstants.Api.SwaggerVersion, new OpenApiInfo
                {
                    Title = AppConstants.Api.SwaggerTitle,
                    Version = AppConstants.Api.SwaggerVersion
                });
            });

            return services;
        }
    }
}
