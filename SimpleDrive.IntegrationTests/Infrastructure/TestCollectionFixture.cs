using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using SimpleDrive.App;
using SimpleDrive.App.Constants;
using SimpleDrive.App.Extensions;
using SimpleDrive.IntegrationTests.Helpers;
using System;
using System.Net.Http;

namespace SimpleDrive.IntegrationTests.TestFixtures
{
    /// <summary>
    ///     Is responsible for global TearUp and TearDown
    /// </summary>
    public class TestCollectionFixture : IDisposable
    {
        protected readonly TestServer _server;

        public readonly HttpClient Client;
        public readonly IServiceScopeFactory ScopeFactory;

        public TestCollectionFixture()
        {
            _server = CreateTestServer();
            Client = _server.CreateClient();
            ScopeFactory = _server.Host.Services.GetRequiredService<IServiceScopeFactory>();

            _server.Host.Migrate();
            _server.Host.SeedData();

            Client.EnsureLoggedIn().Wait();
        }

        public void Dispose()
        {
            Client.ClearCookies();
            _server.Host.Drop();

            Client.Dispose();
            _server.Dispose();
        }

        private TestServer CreateTestServer() => new 
            TestServer(WebHost.CreateDefaultBuilder()
                .UseStartup<Startup>()
                .UseEnvironment(EnvironmentOptions.TestingName));
    }
}
