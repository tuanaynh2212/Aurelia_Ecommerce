using AureliaE_Commerce.Constants;
using AureliaE_Commerce.Extensions;
using AureliaE_Commerce.Hubs;
using dotenv.net;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
    DotEnv.Load();

builder.Services
    .AddMongoServices(builder.Configuration)
    .AddApplicationServices()
    .AddSwaggerDocs()
    .AddCorsPolicy()
    .AddJwtAuthentication(builder.Configuration);

AuthExtensions.InitializeFirebase();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(AppConstants.Api.SwaggerEndpoint, $"{AppConstants.Api.SwaggerTitle} {AppConstants.Api.SwaggerVersion}");
    options.RoutePrefix = string.Empty;
});

app.UseRouting();
app.UseCors(AppConstants.Cors.PolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<NotifyHub>(AppConstants.Api.NotifyHubRoute);
app.MapControllers();

app.Run();
