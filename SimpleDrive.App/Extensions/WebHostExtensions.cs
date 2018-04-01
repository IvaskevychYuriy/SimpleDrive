using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Models;

namespace SimpleDrive.App.Extensions
{
    public static class WebHostExtensions
    {
        public static void SeedData(this IWebHost host)
        {
            var scopeFactory = host.Services.GetRequiredService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetService<ApplicationDbContext>();

                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
                var adminRole = roleManager.FindByNameAsync("Administrator").Result;
                if (adminRole == null)
                {
                    roleManager.CreateAsync(new Role("Administrator")).Wait();
                }
                var userRole = roleManager.FindByNameAsync("User").Result;
                if (userRole == null)
                {
                    roleManager.CreateAsync(new Role("User")).Wait();
                }

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                var adminUser = userManager.FindByNameAsync("Administrator").Result;
                if (adminUser == null)
                {
                    var admin = new User()
                    {
                        UserName = "Administrator",
                        Email = "admin@gmail.com",
                        LockoutEnabled = false
                    };

                    userManager.CreateAsync(admin, "admin").Wait();
                    userManager.AddToRolesAsync(admin, new[] { "User", "Administrator" }).Wait();
                }

                db.SaveChanges();
            }
        }
    }
}
