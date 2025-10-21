using Microsoft.AspNetCore.Mvc;
using Supabase;
using CalorieIntakeTracker.api.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Supabase.Gotrue;
using User = CalorieIntakeTracker.api.Models.Auth.User;

namespace CalorieIntakeTracker.api.Controllers
{
    [ApiController]
    [Route("api/account/")]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public AuthController(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var options = new SignUpOptions
                {
                    Data = new Dictionary<string, object>
                    {
                        {"username", request.Name }
                    }
                };
                var session = await _supabase.Auth.SignUp(request.Email, request.Password, options);
                
                if (session?.User == null)
                {
                    return BadRequest("Registration failed");
                }

                return Ok(new AuthResponse
                {
                    AccessToken = session.AccessToken ?? string.Empty,
                    RefreshToken = session.RefreshToken ?? string.Empty,
                    User = new Models.Auth.User
                    {
                        Id = Guid.Parse(session.User.Id),
                        Email = session.User.Email ?? string.Empty,
                        CreatedAt = session.User.CreatedAt,
                        Username = session.User.UserMetadata["username"]
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var session = await _supabase.Auth.SignIn(request.Email, request.Password);
                
                if (session?.User == null)
                {
                    return Unauthorized("Invalid credentials");
                }

                return Ok(new AuthResponse
                {
                    AccessToken = session.AccessToken ?? string.Empty,
                    RefreshToken = session.RefreshToken ?? string.Empty,
                    User = new User
                    {
                        Id = Guid.Parse(session.User.Id),
                        Email = session.User.Email ?? string.Empty,
                        CreatedAt = session.User.CreatedAt,
                        Username = session.User.UserMetadata["username"]
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Login failed: {ex.Message}");
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _supabase.Auth.SignOut();
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Logout failed: {ex.Message}");
            }
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult<User> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;

            if (userIdClaim == null || emailClaim == null)
            {
                return Unauthorized();
            }

            return Ok(new User
            {
                Id = Guid.Parse(userIdClaim),
                Email = emailClaim
            });
        }
    }
}