using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebGame.Server.Models
{
    [PrimaryKey(nameof(BuildingId), nameof(Level))]
    public class BuildingLevel
    {
        public int BuildingId { get; set; }
        public int Level { get; set; }
        public int UpgradeCost { get; set; }
        public int ResourceGain { get; set; }
        public int GainIntervalSeconds { get; set; } = 30;
    }
}