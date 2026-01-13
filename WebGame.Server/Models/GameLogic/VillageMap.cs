namespace WebGame.Server.Models
{
    public class VillageMap
    {
        public Building?[,] BuildingLayer { get; private set; }
        public Tile?[,] GroundLayer { get; private set; }
        public bool[,] OccupiedAreasLayer { get; private set; }
        public int FreeSpace
        {
            get
            {
                int freeSpace = 0;
                for (int x = 0; x < OccupiedAreasLayer.GetLength(0); x++)
                {
                    for (int y = 0; y < OccupiedAreasLayer.GetLength(1); y++)
                    {
                        if (!OccupiedAreasLayer[x, y]) freeSpace++;
                    }
                }
                return freeSpace;
            }
        }
        public VillageMap(Building?[,] _buildingLayer, Tile?[,] _groundLayer)
        {
            BuildingLayer = _buildingLayer;
            GroundLayer = _groundLayer;
            OccupiedAreasLayer = CalculateOccupiedAreasLayer();
        }
        private bool[,] CalculateOccupiedAreasLayer()
        {
            bool[,] occupiedAreas = new bool[GroundLayer.GetLength(0), GroundLayer.GetLength(1)];

            for (int x = 0; x < BuildingLayer.GetLength(0); x++)
            {
                for (int y = 0; y < BuildingLayer.GetLength(1); y++)
                {
                    Building? building = BuildingLayer[x, y];
                    if (building != null)
                    {
                        occupiedAreas = WriteRectTo2dArray(occupiedAreas, x, y, building.Width, building.Height, true);
                    }
                }
            }

            for (int x = 0; x < GroundLayer.GetLength(0); x++)
            {
                for (int y = 0; y < GroundLayer.GetLength(1); y++)
                {
                    Tile? tile = GroundLayer[x, y];
                    if (tile != null && !tile.IsPlaceable)
                    {
                        occupiedAreas[x, y] = true;
                    }
                }
            }

            return occupiedAreas;
        }
        private bool CanPlaceBuilding(int bottomLeftX, int bottomLeftY, int width, int height)
        {
            for (int x = bottomLeftX; x < bottomLeftX + width; x++)
            {
                if (x > OccupiedAreasLayer.GetLength(0)) return false;

                for (int y = bottomLeftY; y < bottomLeftY + height; y++)
                {
                    if (y > OccupiedAreasLayer.GetLength(1)) return false;

                    if (OccupiedAreasLayer[x, y]) return false;
                }
            }

            return true;
        }
        private T[,] WriteRectTo2dArray<T>(T[,] array, int bottomLeftX, int bottomLeftY, int width, int height, T value)
        {
            for (int x = bottomLeftX; x < bottomLeftX + width; x++)
            {
                for (int y = bottomLeftY; y < bottomLeftY + height; y++)
                {
                    array[x, y] = value;
                }
            }
            return array;
        }
        public void PlaceBuilding(MapBuilding building)
        {
            if (!CanPlaceBuilding(building.BottomLeftX, building.BottomLeftY, building.Building.Width, building.Building.Height)) throw new Exception("Building cannot be placed here.");

            BuildingLayer[building.BottomLeftX, building.BottomLeftY] = building.Building;
            OccupiedAreasLayer = WriteRectTo2dArray(OccupiedAreasLayer, building.BottomLeftX, building.BottomLeftY, building.Building.Width, building.Building.Height, true);
        }
        public void DestroyBuilding(MapBuilding building)
        {
            if (BuildingLayer[building.BottomLeftX, building.BottomLeftY] == null) throw new Exception($"No building exists on x: {building.BottomLeftX} and y: {building.BottomLeftY}");

            BuildingLayer[building.BottomLeftX, building.BottomLeftY] = null;
            OccupiedAreasLayer = WriteRectTo2dArray(OccupiedAreasLayer, building.BottomLeftX, building.BottomLeftY, building.Building.Width, building.Building.Height, false);
        }
    }
}