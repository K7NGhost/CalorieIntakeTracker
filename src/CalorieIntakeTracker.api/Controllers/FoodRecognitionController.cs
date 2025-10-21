using CalorieIntakeTracker.api.Interfaces;
using CalorieIntakeTracker.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CalorieIntakeTracker.api.Controllers
{
    [ApiController]
    [Route("api/food-recognition")]
    [Authorize]
    public class FoodRecognitionController : ControllerBase
    {
        private readonly FoodRecognitionService _foodRecognitionService;
        private readonly IFoodRepository _foodRepo;

        public FoodRecognitionController(FoodRecognitionService foodRecognitionService, IFoodRepository foodRepo)
        {
            _foodRepo = foodRepo;
            _foodRecognitionService = foodRecognitionService;
        }

        [HttpPost("ai")]
        public async Task<IActionResult> RecognizeFood([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No Image uploaded.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();

            var result = await _foodRecognitionService.RecognizeFoodAsync(imageBytes, file.FileName);

            if (result == null)
                return StatusCode(500, "AI did not return a valid respones");

            return Ok(result);
        }

        [HttpPost("barcode")]
        public async Task<IActionResult> RecognizeFoodByBarcode([FromForm] IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest(new { error = "No image file uploaded or file is empty." });

            try
            {
                var barcodeText = await _foodRecognitionService.RecognizeFoodByBarcodeAsync(imageFile);

                if (string.IsNullOrWhiteSpace(barcodeText))
                    return NotFound(new { message = "No barcode detected in the image." });

                return Ok(new { barcode = barcodeText });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to process image.", details = ex.Message });
            }
        }
    }
}
