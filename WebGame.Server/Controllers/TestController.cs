using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            Building[] buildings = _dbc.Buldings.Include(b => b.Levels).ToArray();   
            if (buildings == null || buildings.Length == 0) return NotFound("No buildings found.");
            return Ok(buildings);
        }

        [HttpGet("tiles")]
        public IActionResult GetTiles()
        {
            Tile[] tiles = _dbc.Tiles.ToArray();   
            if (tiles == null || tiles.Length == 0) return NotFound("No tiles found.");
            return Ok(tiles);
        }

        [HttpGet("levels")]
        public IActionResult GetLevels()
        {
            BuildingLevel[] levels = _dbc.BuildingLevels.ToArray();
            if (levels == null || levels.Length == 0) return NotFound("No building levels found.");
            return Ok(levels);
        }

        [HttpGet("resources")]
        public IActionResult GetResources()
        {
            Resource[] resources = _dbc.Resources.ToArray();
            if (resources == null || resources.Length == 0) return NotFound("No resources found.");
            return Ok(resources);
        }


        [HttpGet("maps")]
        public IActionResult GetMaps()
        {
            Map[] maps = _dbc.Maps
                .Include(m => m.Tiles)
                    .ThenInclude(mt => mt.Tile)
                .Include(m => m.Buildings)
                    .ThenInclude(mb => mb.Building)
                .ToArray();

            if (maps == null || maps.Length == 0) return NotFound("No maps found.");
            return Ok(maps);
        }
    }
}