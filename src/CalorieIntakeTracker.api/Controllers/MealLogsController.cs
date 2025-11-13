using CalorieIntakeTracker.api.Data;
using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Models.Food;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalorieIntakeTracker.api.Controllers
{
    [Route("api/users/{userId}/mealLogs")]
    [ApiController]
    public class MealLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public MealLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMealLog(Guid userId, [FromBody] MealLogCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var mealLog = new MealLog
            {
                UserId = userId,
                MealType = dto.MealType,
                TotalCalories = dto.TotalCalories,
                TotalProtein = dto.TotalProtein,
                TotalCarbs = dto.TotalCarbs,
                TotalFat = dto.TotalFat,
                LoggedAt = DateTime.UtcNow
            };

            _context.MealLogs.Add(mealLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMealLog), new { userId, id = mealLog.Id }, mealLog);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMealLog(Guid userId, int id)
        {
            var mealLog = await _context.MealLogs.Include(m => m.FoodItems).FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

            if (mealLog == null) return NotFound();
            return Ok(mealLog);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMealLogs(Guid userId)
        {
            var mealLogs = await _context.MealLogs
                .Include(m => m.FoodItems)
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.LoggedAt)
                .ToListAsync();

            return Ok(mealLogs);
        }

    }
}
