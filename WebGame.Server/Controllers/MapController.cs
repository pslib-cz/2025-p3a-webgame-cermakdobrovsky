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
            Building[] buildings = await _dbc.Buildings.AsNoTracking().Include(b => b.Levels).ToArrayAsync();
            if (buildings == null || buildings.Length == 0) return NotFound("No buildings found.");
            return Ok(buildings);
        }
        [HttpGet("ground")]
        public async Task<ActionResult<Map>> GetGroundMaps()
        {
            Map? map = await _dbc.Maps.AsNoTracking().Include(m => m.Tiles).ThenInclude(mt => mt.Tile).Include(m => m.Buildings).ThenInclude(mb => mb.Building).Where(m => m.Title.StartsWith("Default ground layer")).SingleOrDefaultAsync();
            if (map == null) return NotFound("No ground map found.");
            return Ok(map);
        }

        [HttpPost("building")]
        public async Task<ActionResult<GameState>> CreateBuilding([FromBody] MapBuildingDTO request)
        {
            GameState? gameState = await _dbc.GameStates
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Buildings)
                .ThenInclude(mb => mb.Building)
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Tiles)
                .ThenInclude(mt => mt.Tile)
                .FirstOrDefaultAsync(gs => gs.PlayerId == request.PlayerId);

            Building? buildingType = await _dbc.Buildings.AsNoTracking().FirstOrDefaultAsync(b => b.BuildingId == request.BuildingId);

            if (gameState == null) return NotFound("Game state not found for the given player ID.");
            if (buildingType == null) return NotFound("Building type not found for the given building ID.");
            if (buildingType.InitialCost > gameState.Sheep) return NotFound("Not enough resources to build this building.");

            // check for collisions
            bool isColiding = !MapUtils.CanPlaceBuilding(
                new MapBuilding
                {
                    Building = buildingType,
                    BottomLeftX = request.BottomLeftX,
                    BottomLeftY = request.BottomLeftY
                },
                gameState.BuildingMap.Buildings.ToArray(),
                gameState.BuildingMap.Tiles.ToArray()
            );
            if (isColiding) return BadRequest("Building placement collides with existing buildings.");

            MapBuilding mapBuilding = new MapBuilding
            {
                BuildingId = request.BuildingId,
                MapId = gameState.BuildingMapId,
                BottomLeftX = request.BottomLeftX,
                BottomLeftY = request.BottomLeftY
            };

            _dbc.MapBuildings.Add(mapBuilding);

            // deduct resources
            gameState.Sheep -= buildingType.InitialCost;
            _dbc.GameStates.Update(gameState);

            await _dbc.SaveChangesAsync();

            GameState? UpdatedGameState = await _dbc.GameStates
                .AsNoTracking()
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Buildings)
                .ThenInclude(mb => mb.Building)
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Tiles)
                .ThenInclude(mt => mt.Tile)
                .FirstOrDefaultAsync(gs => gs.PlayerId == request.PlayerId);

            return Ok(UpdatedGameState);
        }
    
        
        [HttpDelete("building/{mapId}/{bottomLeftX}/{bottomLeftY}")]
        public async Task<IActionResult> DeleteBuilding(int mapId, int bottomLeftX, int bottomLeftY)
        { 
            MapBuilding? mapBuilding = await _dbc.MapBuildings.FindAsync(mapId, bottomLeftX, bottomLeftY);
            if (mapBuilding == null) return NotFound("Building not found.");
            _dbc.MapBuildings.Remove(mapBuilding);
            await _dbc.SaveChangesAsync();
            return NoContent();
        }
    }
}