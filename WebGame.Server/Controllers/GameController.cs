using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebGame.Server.Data;
using WebGame.Server.Models;

namespace WebGame.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameDbContext _dbc;
        public GameController(GameDbContext context)
        {
            _dbc = context;
        }
        [HttpGet("create")]
        public async Task<IActionResult> GetPlayers(string? playerId = null)
        {
            string readableWord = !string.IsNullOrEmpty(playerId) ? playerId : new WordGenerator().Generate(6);
            // create new map
            var buildingMap = new Map { Title = "Building Layer:" + readableWord };
            _dbc.Maps.Add(buildingMap);

            var townHall = new MapBuilding
            {
                BuildingId = 1,
                MapId = buildingMap.MapId,
                BottomLeftX = 18,
                BottomLeftY = 3
            };

            _dbc.MapBuildings.Add(townHall);

            GameState newGameState = new GameState
            {
                PlayerId = readableWord,
                Sheep = 100,
                Population = 10,
                LastUpdated = DateTime.UtcNow,
                BuildingMapId = buildingMap.MapId
            };
            _dbc.GameStates.Add(newGameState);
            await _dbc.SaveChangesAsync();
            
            return Ok(readableWord);
        }
        [HttpGet("state/{playerId}")]
        public async Task<ActionResult<GameState>> GetGameState(string playerId)
        {
            var gameState = await _dbc.GameStates
                .AsNoTracking()
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Buildings)
                .ThenInclude(mb => mb.Building)
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Tiles)
                .ThenInclude(mt => mt.Tile)
                .FirstOrDefaultAsync(gs => gs.PlayerId == playerId);
            if (gameState == null)
            {
                return NotFound("Game state not found for the given player ID.");
            }
            return Ok(gameState);
        }
    }
}