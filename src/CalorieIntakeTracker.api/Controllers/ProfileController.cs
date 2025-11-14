using CalorieIntakeTracker.api.Dtos.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CalorieIntakeTracker.api.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly Supabase.Client _supabase;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(Supabase.Client supabase, ILogger<ProfileController> logger)
        {
            _supabase = supabase;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> SaveProfile([FromBody] UserProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();
            _logger.LogInformation($"UserId: {userId}");

            var profile = new Profile
            {
                Id = Guid.Parse(userId),
                Age = dto.Age,
                WeightLb = dto.WeightLb,
                HeightFt = dto.HeightFt,
                Sex = dto.Sex,
                ActivityLevel = dto.ActivityLevel,
                Goal = dto.Goal,
                UpdatedAt = DateTime.UtcNow
            };

            var response = await _supabase
                .From<Profile>()
                .Upsert(profile);

            return Ok("Profile saved");
        }

        [Authorize]
        [HttpGet("calculate")]
        public async Task<ActionResult<CalorieResultDto>> Calculate()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            // Fix: Use Supabase.Postgrest.Constants.Operator.Eq instead of "eq"
            var result = await _supabase
                .From<Profile>()
                .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, userId)
                .Single();

            if (result == null)
                return NotFound("No profile found");

            return Ok(CalculateMacros(result));
        }


        private CalorieResultDto CalculateMacros(Profile profile)
        {
            // Convert lbs → kg
            double weightKg = (profile.WeightLb ?? 0) * 0.453592;

            // Convert feet → cm
            double heightCm = (profile.HeightFt ?? 0) * 30.48;

            int age = profile.Age ?? 0;
            string sex = profile.Sex ?? "Male";
            string activity = profile.ActivityLevel ?? "Sedentary";
            string goal = profile.Goal ?? "Maintain";

            _logger.LogInformation($"age: {age}, sex: {sex}, activity: {activity}, goal: {goal}");

            // BMR (Mifflin-St Jeor)
            double bmr = sex == "Male"
                ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
                : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

            double multiplier = activity switch
            {
                "Sedentary" => 1.2,
                "Light" => 1.375,
                "Moderate" => 1.55,
                "Very" => 1.725,
                "Super" => 1.9,
                _ => 1.2
            };

            double tdee = bmr * multiplier;

            double target = goal switch
            {
                "Lose" => tdee - 500,
                "Gain" => tdee + 300,
                _ => tdee
            };

            double protein = (0.3 * target) / 4;
            double carbs = (0.4 * target) / 4;
            double fat = (0.3 * target) / 9;

            return new CalorieResultDto
            {
                DailyCalories = Math.Round(target),
                ProteinGrams = Math.Round(protein),
                CarbGrams = Math.Round(carbs),
                FatGrams = Math.Round(fat)
            };
        }

    }
}
