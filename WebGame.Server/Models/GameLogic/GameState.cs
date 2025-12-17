namespace WebGame.Server.Models
{
    public class GameState
    {
        public Guid PlayerId { get; set; }
        public int Sheep { get; set; }
        public int Population { get; set; }
        public DateTime LastUpdated { get; set; }
        public VillageMap Map { get; set; }

        public GameState(Guid _playerId, Building?[,] _initBuildingLayer, Tile?[,] _initGroundLayer)
        {
            PlayerId = _playerId;
            Sheep = 0;
            Population = 1;

            LastUpdated = DateTime.Now;
            Map = new VillageMap(_initBuildingLayer, _initGroundLayer);
        }
    }
}