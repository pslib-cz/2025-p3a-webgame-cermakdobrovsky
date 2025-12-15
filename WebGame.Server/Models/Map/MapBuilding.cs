namespace WebGame.Server.Models
{
    public class MapBuilding
    {
        public int TopLeftX { get; set; }
        public int TopLeftY { get; set; }
        public Building Building{ get; set; } = null!;
    }
}