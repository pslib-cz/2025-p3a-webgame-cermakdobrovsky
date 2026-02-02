using System.ComponentModel.DataAnnotations;

namespace WebGame.Server.Models
{
    public class Tile
    {
        [Key]
        public int TileId { get; set; }
        public bool IsPlaceable { get; set; } = false;
        public bool IsEdge { get; set; } = false;
        public string ImageUrl => $"/images/tiles/{TileId}.png";
    }
}