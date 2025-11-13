using CalorieIntakeTracker.api.Models.Food;
using Microsoft.EntityFrameworkCore;

namespace CalorieIntakeTracker.api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<FoodItem> FoodItems => Set<FoodItem>();
        public DbSet<MealLog> MealLogs => Set<MealLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FoodItem>().HasIndex(f => new { f.Food }).IsUnique();

            modelBuilder.Entity<MealLog>().
                HasMany(m => m.FoodItems)
                .WithOne(f => f.MealLog)
                .HasForeignKey(f => f.MealLogId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
