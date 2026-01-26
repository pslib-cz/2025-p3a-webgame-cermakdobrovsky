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
        [HttpGet("ground")]
        public async Task<ActionResult<Map>> GetGroundMaps()
        {
            Map? map = await _dbc.Maps.Include(m => m.Tiles).ThenInclude(mt => mt.Tile).Include(m => m.Buildings).ThenInclude(mb => mb.Building).Where(m => m.Title.StartsWith("Default ground layer")).SingleOrDefaultAsync();
            if (map == null) return NotFound("No ground map found.");
            return Ok(map);
        }

        [HttpPost("building")]
        public async Task<ActionResult<Map>> CreateBuilding([FromBody] MapBuildingDTO request)
        {
            GameState? gameState = await _dbc.GameStates.FirstOrDefaultAsync(gs => gs.PlayerId == request.PlayerId);
            Building? buildingType = await _dbc.Buildings.FirstOrDefaultAsync(b => b.BuildingId == request.BuildingId);

            if (gameState == null) return NotFound("Game state not found for the given player ID.");
            if (buildingType == null) return NotFound("Building type not found for the given building ID.");
            if (buildingType.InitialCost > gameState.Sheep) return NotFound("Not enough resources to build this building.");
    
            var mapBuilding = new MapBuilding
            {
                BuildingId = request.BuildingId,
                MapId = gameState.buildingMapId,
                BottomLeftX = request.BottomLeftX,
                BottomLeftY = request.BottomLeftY
            };

            _dbc.MapBuildings.Add(mapBuilding);
            await _dbc.SaveChangesAsync();

            var map = await _dbc.Maps
                .Include(m => m.Tiles).ThenInclude(mt => mt.Tile)
                .Include(m => m.Buildings).ThenInclude(mb => mb.Building)
                .FirstOrDefaultAsync(m => m.MapId == gameState.buildingMapId);

            return Ok(map);
        }
    }
}