namespace CalorieIntakeTracker.api.Models.AI
{
    public class AIRecognitionResult
    {
        public required string Food { get; set; }
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fats { get; set; }
        public double Confidence { get; set; }
        public string? Description { get; set; }
    }
}
