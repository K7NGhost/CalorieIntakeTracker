using CalorieIntakeTracker.api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Rystem.OpenAi.Chat;
using Rystem.OpenAi.Files;
using System;
using System.Collections.Generic;
using System.Text;

namespace CalorieIntakeTracker.api.tests.Services
{
    public class FoodRecognitionTests
    {
        private readonly ITestOutputHelper _output;
        private readonly IOpenAiChat _chat;
        private readonly IOpenAiFile _file;
        private readonly ILogger<FoodRecognitionService> _logger;
        private readonly FoodRecognitionService _service;
        private readonly string _testImage = Path.Combine(AppContext.BaseDirectory, "Images", "burger.jpg");
        private readonly string _barcodeTestImage = Path.Combine(AppContext.BaseDirectory, "Images", "barcode_test_3.jpg");

        public FoodRecognitionTests(ITestOutputHelper output)
        {
            _output = output;
            var config = new ConfigurationBuilder().AddUserSecrets<FoodRecognitionTests>().Build();

            var apiKey = config["OpenAI:Key"] ?? throw new InvalidOperationException("OpenAI key not configured");
            var openAIModel = config["OpenAI:Model"] ?? throw new InvalidOperationException("OpenAI model not configured");

            var services = new ServiceCollection();
            services.AddOpenAi(settings =>
            {
                settings.ApiKey = apiKey;
                settings.DefaultRequestConfiguration.Chat = chat => chat.WithModel(openAIModel);
            });
            services.AddLogging(options =>
            {
                options.AddDebug();
            });

            var provider = services.BuildServiceProvider();
            _chat = provider.GetRequiredService<IOpenAiChat>();
            _file = provider.GetRequiredService<IOpenAiFile>();
            _logger = provider.GetRequiredService<ILogger<FoodRecognitionService>>();
            _logger.LogInformation($"The api key for openai is: {apiKey}");
        }

        [Fact]
        public async Task RecognizeFoodAsync_ReturnsRealResult()
        {
            var service = new FoodRecognitionService(_logger, _chat, _file);
            var image = await File.ReadAllBytesAsync(_testImage);

            var result = await service.RecognizeFoodAsync(image, "burger.jpg");
            _output.WriteLine($"The returned result is {result}");
            Assert.False(string.IsNullOrWhiteSpace(result));
        }

        [Fact]
        public async Task RecognizeFoodAsync_BarcodeReturnResult()
        {
            var service = new FoodRecognitionService(_logger, _chat, _file);
            var imageBytes = await File.ReadAllBytesAsync(_barcodeTestImage);
            var stream = new MemoryStream(imageBytes);
            var formFile = new FormFile(stream, 0, stream.Length, "image", "barcode_sample.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var result = await service.RecognizeFoodByBarcodeAsync(formFile);
            _output.WriteLine($"finished result");
            Assert.False(string.IsNullOrWhiteSpace(result));
            _output.WriteLine($"The returned result is: {result}");

        }
    }
}
