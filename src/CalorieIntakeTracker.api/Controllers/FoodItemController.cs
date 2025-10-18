using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Supabase;
using CalorieIntakeTracker.api.Models.Food;
using System.Security.Claims;
using CalorieIntakeTracker.api.Dtos.Food;
using CalorieIntakeTracker.api.Repository;
using CalorieIntakeTracker.api.Mappers;
using CalorieIntakeTracker.api.Interfaces;

namespace CalorieIntakeTracker.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FoodItemController : ControllerBase
    {
        private readonly Client _supabase;
        private readonly IFoodRepository _foodRepo;

        public FoodItemController(Client supabase, IFoodRepository foodRepo)
        {
            _supabase = supabase;
            _foodRepo = foodRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodItem>>> GetAll()
        {
            var items = await _foodRepo.GetAllAsync();
            return Ok(items);
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
        public async Task<ActionResult<FoodItem>> Create([FromBody] FoodItemCreateDto foodDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var foodModel = FoodMapper.ToFoodItemFromCreateDto(foodDto);
            await _foodRepo.CreateAsync(foodModel);
            return CreatedAtAction(nameof(GetById), new { id = foodModel.Id }, foodModel);
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