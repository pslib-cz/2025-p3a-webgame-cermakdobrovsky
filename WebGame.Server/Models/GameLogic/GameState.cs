namespace WebGame.Server.Models
{
    public class GameState
    {
        public Guid PlayerId { get; set; }
        public int Sheep { get; set; }
        public int Population { get; set; }
        public DateTime LastUpdated { get; set; }
        // public VillageMap Map = new VillageMap();

        public GameState(Guid _playerId, DateTime _lastUpdated)
        {
            PlayerId = _playerId;
            LastUpdated = _lastUpdated;
            Sheep = 0;
            Population = 1;
        }
    }
}