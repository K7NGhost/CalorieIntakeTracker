using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CalorieIntakeTracker.api.Models.Food
{
    [Table("food_entries")]
    public class FoodItem
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key
        public int MealLogId { get; set; }

        [Required]
        public string Food { get; set; } = string.Empty;
        public double ServingSizeGrams { get; set; }

        // Nutrional info
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }

        [JsonIgnore]
        [ForeignKey("MealLogId")]
        public MealLog? MealLog { get; set; }
    }
}
