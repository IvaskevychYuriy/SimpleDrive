using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SimpleDrive.App.Constants;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Models;

namespace SimpleDrive.App.Extensions
{
    public static class WebHostExtensions
    {
        private const string DefaultAdminUserName = "Administrator";
        private const string DefaultAdminUserEmail = "admin@gmail.com";
        private const string DefaultAdminUserPass = "admin";
        
        public static void SeedData(this IWebHost host)
        {
            var scopeFactory = host.Services.GetRequiredService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
                
                SeedRoles(scope);
                SeedUsers(scope);

                db.SaveChanges();
            }
        }

        private static void SeedRoles(IServiceScope scope)
        {
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
            var adminRole = roleManager.FindByNameAsync(RoleNames.AdminRoleName).Result;
            if (adminRole == null)
            {
                roleManager.CreateAsync(new Role(RoleNames.AdminRoleName)).Wait();
            }

            var userRole = roleManager.FindByNameAsync(RoleNames.UserRoleName).Result;
            if (userRole == null)
            {
                roleManager.CreateAsync(new Role(RoleNames.UserRoleName)).Wait();
            }
        }

        private static void SeedUsers(IServiceScope scope)
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var adminUser = userManager.FindByNameAsync(DefaultAdminUserName).Result;
            if (adminUser == null)
            {
                var admin = new User()
                {
                    UserName = DefaultAdminUserName,
                    Email = DefaultAdminUserEmail,
                    LockoutEnabled = false
                };

                userManager.CreateAsync(admin, DefaultAdminUserPass).Wait();
                userManager.AddToRolesAsync(admin, new[] { RoleNames.UserRoleName, RoleNames.AdminRoleName }).Wait();
            }
        }
    }
}
