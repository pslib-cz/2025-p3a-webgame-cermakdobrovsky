namespace WebGame.Server.Models
{
    public class VillageMap
    {
        public int[,] BuildingLayer { get; private set; }
        public int[,] GroundLayer { get; private set; }
        public int[,] OccupiedAreasLayer { get; private set; }
        public int FreeSpace { get; private set; }

        public VillageMap(int[,] _buildingLayer, int[,] _groundLayer)
        {
            BuildingLayer = _buildingLayer;
            GroundLayer = _groundLayer;
            OccupiedAreasLayer = CalculateOccupiedAreasLayer(); // WIP
            FreeSpace = CalculateFreeSpace(); // WIP
        }

        private int CalculateFreeSpace()
        {
            return 0; // WIP
        }
        private int[,] CalculateOccupiedAreasLayer()
        {
            return new int[GroundLayer.GetLength(0), GroundLayer.GetLength(1)]; // WIP
        }

        private bool CanPlaceBuilding(int topLeftX, int topLeftY, int width, int height)
        {
            for (int x = topLeftX; x < topLeftX + width; x++)
            {
                if (x > OccupiedAreasLayer.GetLength(0)) return false;

                for (int y = topLeftY; y < topLeftY + height; y++)
                {
                    if (y > OccupiedAreasLayer.GetLength(1)) return false;

                    if (OccupiedAreasLayer[x, y] == 1) return false;
                }
            }

            return true;
        }

        private void WriteRectToOccupiedAreasLayer(int topLeftX, int topLeftY, int width, int height, int value)
        {
            for (int x = topLeftX; x < topLeftX + width; x++)
            {
                for (int y = topLeftY; y < topLeftY + height; y++)
                {
                    OccupiedAreasLayer[x, y] = 1;
                }
            }
        }

        public void PlaceBuilding(int topLeftX, int topLeftY, int id, int width, int height)
        {
            if (!CanPlaceBuilding(topLeftX, topLeftY, width, height)) throw new Exception("Building cannot be placed here.");

            BuildingLayer[topLeftX, topLeftY] = id;
            WriteRectToOccupiedAreasLayer(topLeftX, topLeftY, width, height, 1);
        }

        public void DestroyBuilding(int topLeftX, int topLeftY, int id, int width, int height)
        {
            if (BuildingLayer[topLeftX, topLeftY] != 0) throw new Exception($"No building exists with x: {topLeftX} and y: {topLeftY}");

            BuildingLayer[topLeftX, topLeftY] = 0;
            WriteRectToOccupiedAreasLayer(topLeftX, topLeftY, width, height, 0);
        }

    }

}
