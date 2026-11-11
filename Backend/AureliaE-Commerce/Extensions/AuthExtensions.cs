using System.Text;
using AureliaE_Commerce.Constants;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace AureliaE_Commerce.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(AppConstants.Cors.PolicyName, policy =>
                {
                    policy.WithOrigins(AppConstants.Cors.AllowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var jwtKey = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.JwtKey)
                ?? configuration[AppConstants.ConfigKeys.JwtKey];

            if (string.IsNullOrWhiteSpace(jwtKey))
                throw new InvalidOperationException($"Missing {AppConstants.EnvKeys.JwtKey} environment variable");

            configuration[AppConstants.ConfigKeys.JwtKey] = jwtKey;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            if (context.Request.Query.TryGetValue(AppConstants.Cookies.SignalRQueryToken, out var token))
                                context.Token = token;

                            return Task.CompletedTask;
                        }
                    };
                });

            return services;
        }

        public static void InitializeFirebase()
        {
            if (FirebaseApp.DefaultInstance != null)
                return;

            var firebaseJson = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.FirebaseCredentialsJson);
            if (string.IsNullOrWhiteSpace(firebaseJson))
                throw new InvalidOperationException($"Missing {AppConstants.EnvKeys.FirebaseCredentialsJson} environment variable");

            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential
                    .FromJson(firebaseJson.Replace("\\n", "\n"))
                    .CreateScoped(AppConstants.Auth.FirebaseScope)
            });
        }
    }
}

