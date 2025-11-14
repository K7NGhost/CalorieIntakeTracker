namespace CalorieIntakeTracker.api.Dtos.Auth
{
    public class UserProfileDto
    {
        public int? Age { get; set; }
        public double? WeightLb { get; set; }
        public double? HeightFt { get; set; }
        public string? Sex { get; set; } = "Male";
        public string? ActivityLevel { get; set; } = "Sedentary";
        public string? Goal { get; set; } = "Maintain";
    }
}
