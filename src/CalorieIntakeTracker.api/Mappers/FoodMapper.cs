using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Models.Food;
using System.Runtime.CompilerServices;

namespace CalorieIntakeTracker.api.Mappers
{
    public static class FoodMapper
    {
        public static FoodItem ToFoodItemFromCreateDto(FoodItemCreateDto foodDto)
        {
            return new FoodItem
            {
                Name = foodDto.Name,
                ServingSizeGrams = foodDto.ServingSizeGrams,
                Calories = foodDto.Calories,
                Protein = foodDto.Protein,
                Carbs = foodDto.Carbs,
                Fat = foodDto.Fat,
                DataSource = foodDto.DataSource
            };
        }
    }
}
