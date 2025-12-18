using Microsoft.EntityFrameworkCore;
using WebGame.Server.Models;
using System.ComponentModel;
using System.Xml.Serialization;

namespace WebGame.Server.Data
{
    public class GameDbContext : DbContext
    {
        // Models
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }
        public DbSet<Building> Buldings { get; set; } = null!;
        public DbSet<Tile> Tiles { get; set; } = null!;
        public DbSet<Map> Maps { get; set; } = null!;
        public DbSet<MapTile> MapTiles { get; set; } = null!;
        public DbSet<MapBuilding> MapBuildings { get; set; } = null!;
        public DbSet<BuildingLevel> BuildingLevels { get; set; } = null!;
        public DbSet<Resource> Resources { get; set; } = null!;

        // Data
        private void SeedResources(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Resource>().HasData(
              new Resource { ResourceId = 1, Name = "Ovce", Description = "Popis ovce" },
              new Resource { ResourceId = 2, Name = "Populace", Description = "Popis populace" },
              new Resource { ResourceId = 3, Name = "Vojsko", Description = "Popis vojska" }
            );
        }
        private void SeedBuildings(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Building>().HasData(
              new Building { BuildingId = 1, Name = "Radnice", Description = "Popis radnice", IsTownHall = true, Width = 10, Height = 7, ResourceId = 2},
              new Building { BuildingId = 2, Name = "Domek", Description = "Popis domu", Width = 4, Height = 6, InitialCost = 90, ResourceId = 2 },
              new Building { BuildingId = 3, Name = "Kostel", Description = "Popis kostelu", Width = 6, Height = 9, InitialCost = 100, ResourceId = 2 },
              new Building { BuildingId = 4, Name = "Střelnice", Description = "Popis střelnice", Width = 6, Height = 7, InitialCost = 110, ResourceId = 3 },
              new Building { BuildingId = 5, Name = "Zbrojírna", Description = "Popis zbrojírny", Width = 6, Height = 7, InitialCost = 120, ResourceId = 3 },
              new Building { BuildingId = 6, Name = "Věž", Description = "Popis věže", Width = 4, Height = 7, InitialCost = 130, ResourceId = 3 }
            );
        }
        private void SeedTiles(ModelBuilder modelBuilder)
        {
            List<Tile> tiles = new List<Tile>();
            int highestId = 107;
            int[] idsToSkip = {4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94, 103, 91, 92, 100, 101, 37, 38, 46, 47};
            int[] nonPlacableTiles = {32, 33, 34, 35, 36, 45, 50, 51, 52, 53, 39, 48, 86, 87, 88, 89, 90, 99, 93, 102, 104, 105, 106, 107};

            for (int id = 1; id <= highestId; id++)
            {
                if (idsToSkip.Contains(id)) continue;
                tiles.Add(new Tile
                {
                    TileId = id,
                    IsPlacable = !nonPlacableTiles.Contains(id)
                });
            }
            modelBuilder.Entity<Tile>().HasData(tiles);
        }
        private void SeedBuildingLevels(ModelBuilder modelBuilder)
        {
            List<BuildingLevel> levels = new List<BuildingLevel>();
            for (int bId = 1; bId <= 6; bId++)
            {
                for (int level = 1; level <= 10; level++)
                {
                    levels.Add(new BuildingLevel
                    {
                        BuildingId = bId,
                        Level = level,
                        UpgradeCost = level * 100,
                        ResourceGain = level * 10,
                        GainIntervalSeconds = 30
                    });
                }
            }
            modelBuilder.Entity<BuildingLevel>().HasData(levels);
        }
        private void SeedDefaultMaps(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Map>().HasData(
                new Map { MapId = 1, Title = "Default ground layer" },
                new Map { MapId = 2, Title = "Default building layer" }
            );

            // buildings
            modelBuilder.Entity<MapBuilding>().HasData(
                new MapBuilding { BuildingId = 1, MapId = 2, TopLeftX = 5, TopLeftY = 5 }
            );

            // tiles
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SeedResources(modelBuilder);
            SeedBuildings(modelBuilder);
            SeedBuildingLevels(modelBuilder);
            SeedTiles(modelBuilder);
            SeedDefaultMaps(modelBuilder);
        }
    }
}
