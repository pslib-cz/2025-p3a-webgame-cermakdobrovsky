using Microsoft.EntityFrameworkCore;
using WebGame.Server.Models;
using System.ComponentModel;

namespace WebGame.Server.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }
        public DbSet<Building> Bulding { get; set; } = null!;
        public DbSet<BuildingLevel> BuildingLevel { get; set; } = null!;
        public DbSet<Resource> Resource { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}