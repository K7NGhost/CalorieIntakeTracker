using CalorieIntakeTracker.api.Models.AI;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CalorieIntakeTracker.api.Models.Food
{
    [Table("meals")]
    public class MealLog
    {
        [Key]
        public int Id { get; set; }
        public Guid  UserId { get; set; }

        [Required]
        public string MealType { get; set; } = string.Empty; // e.g., breakfast, lunch, dinner

        [Required]
        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

        public ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
        public double TotalCalories { get; set; }
        public double TotalProtein { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalFat { get; set; }
    }
}
