using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebGame.Server.Models
{
    [PrimaryKey(nameof(BuildingId), nameof(MapId))]
    public class MapBuilding
    {
        public int TopLeftX { get; set; }
        public int TopLeftY { get; set; }

        public int BuildingId { get; set; }
        [ForeignKey(nameof(BuildingId))]
        public Building Building{ get; set; } = null!;

        public int MapId { get; set; }
    }
}