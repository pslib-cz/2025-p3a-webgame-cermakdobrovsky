using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using WebGame.Server.Data;
using WebGame.Server.Models;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        private readonly GameDbContext _dbc;
        public MapController(GameDbContext context)
        {
            _dbc = context;
        }
        //EndPoints
        [HttpGet("buildings")]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildings()
        {
            var buildings = await _dbc.Buildings.Include(b => b.Levels).ToListAsync();
            if (buildings == null || buildings.Count == 0) return NotFound("No buildings found.");
            return Ok(buildings);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildingsByLevel([FromQuery] int level)
        {
            var buildings = await _dbc.Buildings.Include(b => b.Levels).Where(b => b.Levels.Any(l => l.Level == level)).ToListAsync();
            if (buildings.Count == 0) return NotFound("No buildings for this level.");
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
        [HttpGet("map")]
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