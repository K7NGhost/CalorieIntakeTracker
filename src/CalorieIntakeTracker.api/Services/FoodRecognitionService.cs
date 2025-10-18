using OpenAI;
using Rystem.OpenAi;
using Rystem.OpenAi.Chat;
using Rystem.OpenAi.Files;
using ZXing;
using ZXing.QrCode;
using System.Drawing;
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

        public async Task<string?> RecognizeFoodAsync(byte[] imageStream, string fileName)
        {
            string base64Image = Convert.ToBase64String(imageStream);
            var uploaded = await _fileClient.UploadFileAsync(imageStream, fileName, MimeType.Jpg, PurposeFileUpload.Vision);
            var messages = _chatClient.AddContent(ChatRole.User).AddText("Identify the food and calories in this image and respond in JSON format with fields 'food' and 'confidence'.").AddImage($"data:image/jpeg;base64,{base64Image}", ResolutionForVision.Auto);
            _chatClient.ForceResponseAsJsonFormat();
            var result = await _chatClient.ExecuteAsync();
            return result.Choices?.FirstOrDefault()?.Message?.Content;
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
