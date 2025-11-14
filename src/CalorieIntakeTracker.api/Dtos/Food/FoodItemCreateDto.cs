using Npgsql.Replication.PgOutput;

namespace CalorieIntakeTracker.api.Dtos.Food
{
    public class FoodItemCreateDto
    {
        public string Food { get; set; } = string.Empty;
        public double ServingSizeGrams { get; set; }

        // Nutritional info
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }

    }
}
