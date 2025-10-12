using Supabase.Postgrest.Attributes;

namespace CalorieIntakeTracker.api.Models.Stats
{
    [Table("goals")]
    public class Goal
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string GoalType { get; set; } = "WeightLoss"; // Could be a enum here
        public double TargetWeightKg { get; set; }
        public DateTime TargetDate { get; set; }

        public double DailyCalorieTarget { get; set; }
        public double ProteinTarget { get; set; }
        public double CarbTarget { get; set; }
        public double FatTarget { get; set; }

    }
}
