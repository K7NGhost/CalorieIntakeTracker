using CalorieIntakeTracker.api.Data;
using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Interfaces;
using CalorieIntakeTracker.api.Mappers;
using CalorieIntakeTracker.api.Models.Food;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Supabase;

namespace CalorieIntakeTracker.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FoodItemController : ControllerBase
    {
        private readonly Client _supabase;
        private readonly IFoodRepository _foodRepo;
        private readonly ApplicationDbContext _context;

        public FoodItemController(Client supabase, IFoodRepository foodRepo, ApplicationDbContext context)
        {
            _supabase = supabase;
            _foodRepo = foodRepo;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodItem>> GetById(int id)
        {
            var item = await _foodRepo.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<FoodItem>> Create(int mealLogId, [FromBody] FoodItemCreateDto foodDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var mealLog = await _context.MealLogs.FindAsync(mealLogId);
            if (mealLog == null)
                return NotFound($"MealLog with ID {mealLogId} not found.");

            var foodModel = FoodMapper.ToFoodItemFromCreateDto(foodDto);
            foodModel.MealLogId = mealLogId;
            await _foodRepo.CreateAsync(foodModel);
            return CreatedAtAction(nameof(GetById), new { id = foodModel.Id }, foodModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetFoodItems(int mealLogId)
        {
            var items = await _context.FoodItems.Where(f => f.MealLogId == mealLogId).ToListAsync();
            return Ok(items);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FoodItem>> Update(int id, [FromBody] FoodItemUpdateDto foodItem)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var foodModel = await _foodRepo.UpdateAsync(id, foodItem);
            if (foodModel == null)
                return NotFound();
            return Ok(foodModel);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var foodModel = await _foodRepo.DeleteAsync(id);
            if (foodModel == null)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}