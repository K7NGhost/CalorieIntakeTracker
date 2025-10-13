using CalorieIntakeTracker.api.Models.AI;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace CalorieIntakeTracker.api.Models.Food
{
    [Table("meals")]
    public class MealLog : BaseModel
    {
        public int Id { get; set; }
        public Guid  UserId { get; set; }

        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
        public string SourceType { get; set; } = "Manual";

        public string? ImageUrl { get; set; }
        public string? Barcode { get; set; }

        public ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
        public double TotalCalories { get; set; }
        public double TotalProtein { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalFat { get; set; }

        public AIRecognitionResult? RecognitionResult { get; set; }
    }
}
