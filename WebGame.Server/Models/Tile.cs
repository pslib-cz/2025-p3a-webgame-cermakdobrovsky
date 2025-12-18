using System.ComponentModel.DataAnnotations;

namespace WebGame.Server.Models
{
    public class Tile
    {
        [Key]
        public int TileId { get; set; }
        public bool IsPlacable { get; set; } = false;
    }
}