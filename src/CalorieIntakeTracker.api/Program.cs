using CalorieIntakeTracker.api.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Supabase;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CalorieIntakeTracker.api.Transformers;
using CalorieIntakeTracker.api.Interfaces;
using CalorieIntakeTracker.api.Repository;
using CalorieIntakeTracker.api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.AddDebug();


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var supabaseUrl = builder.Configuration["Supabase:Url"] ?? throw new InvalidOperationException("Supabase URL not configured");
var supabaseKey = builder.Configuration["Supabase:Key"] ?? throw new InvalidOperationException("Supabase URL not configured");
var supabaseValidIssuer = builder.Configuration["Supabase:ValidIssuer"] ?? throw new InvalidOperationException("Supabase URL not configured");
var supabaseAudience = builder.Configuration["Supabase:ValidAudience"] ?? throw new InvalidOperationException("Supabase key not configured");
var supabaseJwtSecret = builder.Configuration["Authentication:JwtSecret"] ?? throw new InvalidOperationException("Supabase JWT Secret not configured");
var apiKey = builder.Configuration["OpenAI:Key"] ?? throw new InvalidOperationException("OpenAI key not configured");
var openAIModel = builder.Configuration["OpenAI:Model"] ?? throw new InvalidOperationException("OpenAI model not configured");

builder.Services.AddOpenAi(settings =>
{
    settings.ApiKey = apiKey;
    settings.DefaultRequestConfiguration.Chat = chatClient =>
    {
        chatClient.WithModel(openAIModel);
    };
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSecret = builder.Configuration["Supabase:JwtSecret"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = supabaseValidIssuer,
            ValidAudience = supabaseAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(supabaseJwtSecret!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<IFoodRepository, FoodRepository>();
builder.Services.AddScoped<FoodRecognitionService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder.Services.AddScoped<Supabase.Client>(_ => new Supabase.Client(
    supabaseUrl,
    supabaseKey,
    new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
    }
));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().AllowCredentials().SetIsOriginAllowed(origin => true).WithOrigins("https://localhost:5173"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
