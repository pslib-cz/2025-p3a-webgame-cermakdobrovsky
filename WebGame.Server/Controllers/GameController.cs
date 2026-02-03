using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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
            
            var townHall = new MapBuilding
            {
                BuildingId = 1,
                BottomLeftX = 17,
                BottomLeftY = 4
            };
            buildingMap.Buildings.Add(townHall);

            // calculate free space
            int freeSpace = 0;
            Map? defaultGroundMap = _dbc.Maps
                .Include(m => m.Tiles)
                .ThenInclude(mt => mt.Tile)
                .FirstOrDefault(m => m.MapId == 1);
            if (defaultGroundMap != null)
            {
                foreach (MapTile tile in defaultGroundMap.Tiles)
                {
                    if (tile.Tile.IsPlaceable)
                    {
                        freeSpace++;
                    }
                }
            }
            Building? townHallBuilding = _dbc.Buildings.FirstOrDefault(b => b.BuildingId == 1);
            if (townHallBuilding != null)
            {
                freeSpace -= townHallBuilding.BaseWidth * townHallBuilding.BaseHeight;
            }

            // create game state
            GameState newGameState = new GameState
            {
                PlayerId = readableWord,
                Sheep = freeSpace / 2,
                Population = 10,
                FreeSpace = freeSpace,
                LastUpdated = DateTime.UtcNow,
                BuildingMap = buildingMap
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
    
        [HttpGet("advance/{playerId}")]
        public async Task<IActionResult> AdvanceGame(string playerId)
        {
            if (string.IsNullOrEmpty(playerId)) return BadRequest("No player ID provided.");

            GameState? gameState = await _dbc.GameStates
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Buildings)
                .ThenInclude(mb => mb.Building)
                .Include(gs => gs.BuildingMap)
                .ThenInclude(m => m.Tiles)
                .ThenInclude(mt => mt.Tile)
                .FirstOrDefaultAsync(gs => gs.PlayerId == playerId);

            if (gameState == null) return NotFound("Game state not found for the given player ID.");

            // calculate new values
            if (gameState.Sheep < gameState.FreeSpace) gameState.Sheep = (int)(gameState.Sheep * 1.1);

            await _dbc.SaveChangesAsync();
            return Ok(gameState);
        }
    }
}