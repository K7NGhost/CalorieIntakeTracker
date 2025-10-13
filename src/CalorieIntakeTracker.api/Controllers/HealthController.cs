using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace CalorieIntakeTracker.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly Client _supabaseClient;

    public HealthController(Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    [HttpGet("supabase")]
    public async Task<IActionResult> CheckSupabaseConnection()
    {
        try
        {
            // Try to initialize the client
            await _supabaseClient.InitializeAsync();
            
            // Simple connection test - just check if we can authenticate
            var user = _supabaseClient.Auth.CurrentUser;
            
            return Ok(new { 
                status = "connected", 
                message = "Supabase connection successful",
                timestamp = DateTime.UtcNow,
                initialized = true
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                status = "error", 
                message = ex.Message,
                timestamp = DateTime.UtcNow 
            });
        }
    }
}
