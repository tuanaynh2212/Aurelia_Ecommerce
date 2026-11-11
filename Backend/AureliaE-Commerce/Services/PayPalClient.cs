using AureliaE_Commerce.Constants;
using PayPalCheckoutSdk.Core;

public static class PayPalClient
{
    public static PayPalHttpClient Client()
    {
        var clientId = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.PayPalClientId);
        var secret = Environment.GetEnvironmentVariable(AppConstants.EnvKeys.PayPalSecret);

        var environment = new SandboxEnvironment(clientId, secret);
        return new PayPalHttpClient(environment);
    }
}
