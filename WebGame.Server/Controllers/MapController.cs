using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            Building[] buildings = await _dbc.Buildings.Include(b => b.Levels).ToArrayAsync();
            if (buildings == null || buildings.Length == 0) return NotFound("No buildings found.");
            return Ok(buildings);
        }
        [HttpGet("buildings/level")]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildingsByLevel([FromQuery] int level)
        {
            Building[] buildings = await _dbc.Buildings.Include(b => b.Levels).Where(b => b.Levels.Any(l => l.Level == level)).ToArrayAsync();
            if (buildings.Length == 0) return NotFound("No buildings for this level.");
            return Ok(buildings);
        }
        [HttpGet("map")]
        public async Task<ActionResult<IEnumerable<Map>>> GetMaps()
        {
            Map[] maps = await _dbc.Maps.Include(m => m.Tiles).ThenInclude(mt => mt.Tile).Include(m => m.Buildings).ThenInclude(mb => mb.Building).ToArrayAsync();
            if (maps == null || maps.Length == 0) return NotFound("No maps found.");
            return Ok(maps);
        }
    }
}