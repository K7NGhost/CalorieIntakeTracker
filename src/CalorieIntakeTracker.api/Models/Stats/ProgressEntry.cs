using Supabase.Postgrest.Attributes;

namespace CalorieIntakeTracker.api.Models.Stats
{
    [Table("progress_entries")]
    public class ProgressEntry
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public DateTime Date { get; set; }
        public double WeightKg { get; set; }
        public double BodyFatPercent { get; set; }
        public double DailyCaloriesConsumed { get; set; }
        public double CaloriesBurned { get; set; }
    }
}
