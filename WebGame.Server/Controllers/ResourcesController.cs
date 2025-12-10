using Microsoft.AspNetCore.Mvc;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourceController : ControllerBase
    {
        [HttpGet("sheep")]
        public IActionResult Get()
        {
            return Ok(new { message = "API: Ground" });
        }

        [HttpGet("population")]
        public IActionResult Get()
        {
            return Ok(new { message = "API: Buildings" });
        }
    }
}
