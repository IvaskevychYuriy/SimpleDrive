using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SimpleDrive.DAL.Models;

namespace SimpleDrive.DAL
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        public DbSet<File> Files { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<ResourcePermission> ResourcePermissions { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasMany(u => u.Files)
                .WithOne(f => f.Owner)
                .HasForeignKey(f => f.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ResourcePermission>()
                .HasOne(p => p.User)
                .WithMany(u => u.ResourcePermissions)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ResourcePermission>()
                .HasOne(p => p.File)
                .WithMany(f => f.ResourcePermissions)
                .HasForeignKey(p => p.FileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ResourcePermission>()
                .HasOne(p => p.Permission)
                .WithMany(p => p.ResourcePermissions)
                .HasForeignKey(p => p.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}