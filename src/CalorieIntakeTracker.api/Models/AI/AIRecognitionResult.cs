namespace CalorieIntakeTracker.api.Models.AI
{
    public class AIRecognitionResult
    {
        public Guid Id { get; set; }
        public Guid MealLogId { get; set; }

        public string? ModelVersion { get; set; }
        public string? DetectedObjectsJson { get; set; }
        public string? Notes { get; set; }
    }
}
