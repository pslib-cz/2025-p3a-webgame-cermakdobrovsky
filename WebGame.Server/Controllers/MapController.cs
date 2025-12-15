using Microsoft.AspNetCore.Mvc;
using WebGame.Server.Data;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        private readonly GameDbContext _context;
        public MapController(GameDbContext context)
        {
            _context = context;
        }
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