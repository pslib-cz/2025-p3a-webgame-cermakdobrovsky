namespace WebGame.Server.Models
{
    public class MapBuilding
    {
        public int X { get; set; }
        public int Y { get; set; }
        public Building Building{ get; set; } = null!;
    }
}