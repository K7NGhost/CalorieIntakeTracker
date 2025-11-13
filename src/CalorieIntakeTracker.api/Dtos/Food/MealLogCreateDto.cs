using CalorieIntakeTracker.api.Models.Food;

namespace CalorieIntakeTracker.api.Dtos.Food
{
    public class MealLogCreateDto
    {
        public string MealType { get; set; } = string.Empty; // e.g., breakfast, lunch, dinner

        public double TotalCalories { get; set; }
        public double TotalProtein { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalFat { get; set; }
    }
}
