namespace WebGame.Server.Models
{
    public class Tile
    {
        public int TileId { get; set; }
        public bool IsPlaceable { get; set; } = false;
    }
}