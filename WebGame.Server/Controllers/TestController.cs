using Microsoft.AspNetCore.Mvc;
using WebGame.Server.Data;
using WebGame.Server.Models;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly GameDbContext _dbc;

        public TestController(GameDbContext context)
        {
            _dbc = context;
        }

        [HttpGet("buildings")]
        public IActionResult GetBuildings()
        {
            Building[] buildings = _dbc.Bulding.ToArray();   
            if (buildings == null || buildings.Length == 0) return NotFound("No buildings found.");
            return Ok(buildings);
        }

        [HttpGet("levels")]
        public IActionResult GetLevels()
        {
            BuildingLevel[] levels = _dbc.BuildingLevel.ToArray();
            if (levels == null || levels.Length == 0) return NotFound("No building levels found.");
            return Ok(levels);
        }

        [HttpGet("resources")]
        public IActionResult GetResources()
        {
            Resource[] resources = _dbc.Resource.ToArray();
            if (resources == null || resources.Length == 0) return NotFound("No resources found.");
            return Ok(resources);
        }

    }
}