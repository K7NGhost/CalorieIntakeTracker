using CalorieIntakeTracker.api.Data;
using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Interfaces;
using CalorieIntakeTracker.api.Models.Food;
using Microsoft.EntityFrameworkCore;

namespace CalorieIntakeTracker.api.Repository
{
    public class FoodRepository : IFoodRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FoodRepository> _logger;
        public FoodRepository(ILogger<FoodRepository> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
            _logger.LogInformation("Initialized Food Repository");
        }

        public async Task<FoodItem> CreateAsync(FoodItem foodItem)
        {
            await _context.FoodItems.AddAsync(foodItem);
            await _context.SaveChangesAsync();
            return foodItem;
        }

        public async Task<FoodItem> DeleteAsync(int id)
        {
            var entity = await _context.FoodItems.FindAsync(id);
            if (entity == null)
                return null;
            _context.FoodItems.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<FoodItem>> GetAllAsync()
        {
            return await _context.FoodItems.ToListAsync();
        }

        public async Task<FoodItem?> GetByIdAsync(int id)
        {
            return await _context.FoodItems.FindAsync(id);
        }

        public async Task<FoodItem?> UpdateAsync(int id, FoodItemUpdateDto foodDto)
        {
            var existing = await _context.FoodItems.FindAsync(id);
            if (existing == null)
                return null;
            existing.Calories = foodDto.Calories;
            existing.ServingSizeGrams = foodDto.ServingSizeGrams;
            existing.Protein = foodDto.Protein;
            existing.Carbs = foodDto.Carbs;
            existing.Fat = foodDto.Fat;
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
