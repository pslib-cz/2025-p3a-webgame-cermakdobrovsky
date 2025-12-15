namespace WebGame.Server.Models
{
    public class MapTile
    {
        public int X { get; set; }
        public int Y { get; set; }
        public Tile Tile { get; set; } = null!;

    }
}