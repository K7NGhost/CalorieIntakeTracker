using CalorieIntakeTracker.api.Interfaces;
using CalorieIntakeTracker.api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CalorieIntakeTracker.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly FoodRecognitionService _foodRecognitionService;
        private readonly IFoodRepository _foodRepo;

        public AiController(FoodRecognitionService foodRecognitionService, IFoodRepository foodRepo)
        {
            _foodRepo = foodRepo;
            _foodRecognitionService = foodRecognitionService;
        }

        [HttpPost("recognize")]
        public async Task<IActionResult> RecognizeFood([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No Image uploaded.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();

            var result = await _foodRecognitionService.RecognizeFoodAsync(imageBytes, file.FileName);

            if (string.IsNullOrWhiteSpace(result))
                return StatusCode(500, "AI did not return a valid respones");

            try
            {
                var jsonObject = System.Text.Json.JsonDocument.Parse(result).RootElement;
                return Ok(jsonObject);
            }
            catch
            {
                return Ok(new { rawResponse = result });
            }
        }
    }
}
