using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebGame.Server.Models
{
    public class GameState
    {  
        [Key]
        public string PlayerId { get; set; }
        public int Sheep { get; set; }
        public int Population { get; set; }
        public DateTime LastUpdated { get; set; }

        public int buildingMapId { get; set; }
        [ForeignKey(nameof(buildingMapId))]
        public Map BuildingMap { get; set; }
    }
}