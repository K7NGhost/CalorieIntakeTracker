using OpenAI;
using Rystem.OpenAi;
using Rystem.OpenAi.Chat;
using Rystem.OpenAi.Files;

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
            _logger.LogInformation($"Uploaded the image: {uploaded.Name}");
            _logger.LogInformation($"Now adding the content");
            var messages = _chatClient.AddContent(ChatRole.User).AddText("Identify the food in this image.").AddImage($"data:image/jpeg;base64,{base64Image}", ResolutionForVision.Auto);
            //_chatClient.ForceResponseAsJsonFormat();
            _logger.LogInformation($"Now Executing");
            var result = await _chatClient.ExecuteAsync();
            _logger.LogInformation($"Returned result: {result}");
            return result.Choices?.FirstOrDefault()?.Message?.Content;
        }
    }
}
