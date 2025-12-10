using Microsoft.AspNetCore.Mvc;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        [HttpGet("ground")]
        public IActionResult Get()
        {
            return Ok(new { message = "API: Ground" });
        }

        [HttpGet("bouldings")]
        public IActionResult Get()
        {
            return Ok(new { message = "API: Buildings" });
        }

        [HttpGet("occupied")]
        public IActionResult Get()
        {
            return Ok(new { message = "API: occupied" });
        }
    }
}
