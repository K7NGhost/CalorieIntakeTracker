using System.ComponentModel.DataAnnotations.Schema;

namespace CalorieIntakeTracker.api.Models.Food
{
    [Table("food_entries")]
    public class FoodItem
    {
        public int Id { get; set; }
        public int MealLogId { get; set; }
        public string Name { get; set; } = null;
        public double ServingSizeGrams { get; set; }

        // Nutrional info
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }

        // Source
        public string? DataSource { get; set; } // USDA, BarcodeDB, AIModel
    }
}
