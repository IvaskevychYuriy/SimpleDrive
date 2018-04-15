using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SimpleDrive.DAL.Models;

namespace SimpleDrive.DAL
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        public DbSet<File> Files { get; set; }

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
                .HasForeignKey(f => f.OwnerId);

            builder.Entity<File>()
                .Property(f => f.CreatedTimestamp)
                .ValueGeneratedOnAdd();

            builder.Entity<File>()
                .Property(f => f.UpdatedTimestamp)
                .ValueGeneratedOnAddOrUpdate();
        }
    }
}