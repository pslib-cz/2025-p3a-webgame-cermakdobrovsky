namespace WebGame.Server.Models
{
    public class VillageMap
    {
        public int[,] BuildingLayer { get; private set; }
        public int[,] GroundLayer { get; private set; }
        public int[,] OccupiedAreasLayer { get; private set; }

        public VillageMap(string buildingLayerPath, string groundLayerPath, string occupiedAreasLayerPath)
        {
            BuildingLayer = LoadLayerFromCsv(buildingLayerPath);
            GroundLayer = LoadLayerFromCsv(groundLayerPath);
            OccupiedAreasLayer = LoadLayerFromCsv(occupiedAreasLayerPath);
        }

        private int[,] LoadLayerFromCsv(string path)
        {
            // load csv
            string[] lines = File.ReadAllLines(path);
            int height = lines.Length;
            int width = lines[0].Split(",").Length;

            int[,] layer = new int[width, height];

            for (int row = 0; row < height; row++) // y axes
            {
                string[] values = lines[row].Split(',');
                if (values.Length != width) throw new Exception($"Row {row} is not {width} long. Fix row lenght inconsistency in CSV file.");

                for (int col = 0; col < width; col++) // x axes
                {
                    layer[col, row] = int.Parse(values[col]);
                }
            }

            return layer;
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