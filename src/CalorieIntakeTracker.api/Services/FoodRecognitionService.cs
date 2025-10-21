using CalorieIntakeTracker.api.Models.AI;
using OpenAI;
using Rystem.OpenAi;
using Rystem.OpenAi.Chat;
using Rystem.OpenAi.Files;
using System.Drawing;
using System.Text.Json;
using ZXing;
using ZXing.QrCode;
using ZXing.Windows.Compatibility;

namespace CalorieIntakeTracker.api.Services
{
    public class FoodRecognitionService
    {
        private readonly IOpenAiFile _fileClient;
        private readonly IOpenAiChat _chatClient;
        private readonly ILogger<FoodRecognitionService> _logger;

        public FoodRecognitionService(ILogger<FoodRecognitionService> logger, IOpenAiChat chatClient, IOpenAiFile fileClient)
        {
            _logger = logger;
            _chatClient = chatClient;
            _fileClient = fileClient;
        }

        public async Task<AIRecognitionResult> RecognizeFoodAsync(byte[] imageStream, string fileName)
        {
            string base64Image = Convert.ToBase64String(imageStream);
            var uploaded = await _fileClient.UploadFileAsync(imageStream, fileName, MimeType.Jpg, PurposeFileUpload.Vision);
            var messages = _chatClient.AddContent(ChatRole.User).AddText("Identify the food and estimate nutritional values in this image. Respond in JSON format with fields 'food', 'calories', 'protein', 'carbs', 'fats', and 'confidence'.")
                .AddImage($"data:image/jpeg;base64,{base64Image}", ResolutionForVision.Auto);
            _chatClient.ForceResponseAsJsonFormat();
            var result = await _chatClient.ExecuteAsync();
            var content = result.Choices?.FirstOrDefault()?.Message?.Content;

            if (string.IsNullOrWhiteSpace(content))
                return null;

            try
            {
                // Deserialize JSON into your model
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var aiResult = JsonSerializer.Deserialize<AIRecognitionResult>(content, options);
                return aiResult;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"JSON Parse Error: {ex.Message}");
                Console.WriteLine($"Raw Response: {content}");
                return null;
            }
        }

        public async Task<string?> RecognizeFoodByBarcodeAsync(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return null;

            // Copy uploaded image to a memory stream
            using var stream = imageFile.OpenReadStream();
            using var bitmap = new Bitmap(stream);

            // Initialize barcode reader
            var reader = new BarcodeReader();

            // Decode barcode
            var result = reader.Decode(bitmap);

            return result?.Text; // returns the barcode string (e.g., "012345678905")
        }
    }
}
