using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleDrive.App.Constants;
using SimpleDrive.App.Options;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Interfaces;
using SimpleDrive.DAL.Models;
using SimpleDrive.DAL.Services;
using System;
using System.Threading.Tasks;

namespace SimpleDrive.App
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }

        public IHostingEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = Configuration.GetConnectionString("ApplicationDbContext");
            bool isPostgres = false;
            if (connectionString.Contains("postgres"))
            {
                isPostgres = true;
                services.AddEntityFrameworkNpgsql();
            }

            if (Environment.EnvironmentName == EnvironmentOptions.TestingName)
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        if (isPostgres)
                        {
                            options.UseNpgsql(connectionString);
                        }
                        else
                        {
                            options.UseSqlServer(connectionString);
                        }

                        options.ConfigureWarnings(cfg => cfg.Ignore(RelationalEventId.AmbientTransactionWarning));
                    },
                    ServiceLifetime.Singleton
                );
            }
            else
            {
                services.AddDbContextPool<ApplicationDbContext>(
                    options =>
                    {
                        if (isPostgres)
                        {
                            options.UseNpgsql(connectionString);
                        }
                        else
                        {
                            options.UseSqlServer(connectionString);
                        }
                    }
                );
            }

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            RegisterSevices(services);

            ConfigureOptions(services);

            services.AddMvc();

            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfiles(typeof(Startup).Assembly);
            });
        }

        private void ConfigureOptions(IServiceCollection services)
        {
            ConfigureAuthOptions(services);

            services.Configure<FileSystemOptions>(Configuration.GetSection("FileSystemOptions"));
        }

        private void ConfigureAuthOptions(IServiceCollection services)
        {
            // TODO: move to config
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            // TODO: move to config
            services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.Cookie.Expiration = TimeSpan.FromDays(150);
                options.LoginPath = "/login"; // If the LoginPath is not set here, ASP.NET Core will default to /Account/Login
                options.LogoutPath = "/logout"; // If the LogoutPath is not set here, ASP.NET Core will default to /Account/Logout
                options.SlidingExpiration = true;
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });
        }

        private void RegisterSevices(IServiceCollection services)
        {
            services.AddTransient<IFileService, FileSystemService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else if (Environment.EnvironmentName == EnvironmentOptions.TestingName)
            {
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseAuthentication();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
            {
                builder.UseMvc(routes =>
                {
                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new { controller = "Home", action = "Index" });
                });
            });
        }
    }
}
