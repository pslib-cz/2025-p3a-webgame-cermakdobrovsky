using System.Collections.Concurrent;

namespace WebGame.Server.Models
{
    public class GameRepository
    {
        private static readonly ConcurrentDictionary<Guid, GameState> _games = new();

        public GameState GetOrCreate(Guid playerId)
        {
            return _games.GetOrAdd(playerId, _ => new GameState(playerId, DateTime.UtcNow));
        }

        public IReadOnlyDictionary<Guid, GameState> AllGames => _games;
    }
}
