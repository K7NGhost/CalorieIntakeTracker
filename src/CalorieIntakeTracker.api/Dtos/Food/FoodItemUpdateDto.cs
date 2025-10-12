namespace CalorieIntakeTracker.api.Dtos.Food
{
    public class FoodItemUpdateDto
    {
        public double ServingSizeGrams { get; set; }

        // Nutritional info
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
    }
}
