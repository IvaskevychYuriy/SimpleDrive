using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using SimpleDrive.App.Extensions;

namespace SimpleDrive.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            host.SeedData();
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
