using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Models.Food;

namespace CalorieIntakeTracker.api.Interfaces
{
    public interface IFoodRepository
    {
        Task<FoodItem> CreateAsync(FoodItem foodItem);
        Task<List<FoodItem>> GetAllAsync();
        Task<FoodItem?> GetByIdAsync(int id);
        Task<FoodItem?> UpdateAsync(int id, FoodItemUpdateDto foodDto);
        Task<FoodItem> DeleteAsync(int id);
    }
}
