using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebGame.Server.Models
{
    [PrimaryKey(nameof(MapId), nameof(X), nameof(Y))]
    public class MapTile
    {
        public int TileId { get; set; }
        [ForeignKey(nameof(TileId))]
        public Tile Tile { get; set; } = null!;
        public int MapId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}