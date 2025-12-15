
namespace WebGame.Server.Models
{

public class GameEngine
{
    private readonly GameRepository _repo;
    private readonly Timer _timer;

    public GameEngine(GameRepository repo)
    {
        _repo = repo;

        // tick every 10 seconds
        _timer = new Timer(_ => AdvanceAllGames(), null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(10));
    }

    private void AdvanceAllGames()
    {
        foreach (GameState game in _repo.AllGames.Values)
        {
            game.Sheep += (int)(game.Population * 0.5);

            game.LastUpdated = DateTime.UtcNow;
        }
    }
}
}
