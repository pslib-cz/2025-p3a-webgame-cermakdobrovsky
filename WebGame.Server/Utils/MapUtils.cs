using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.StaticAssets;

namespace WebGame.Server.Models
{
    public static class MapUtils
    {   
        public static bool CanPlaceBuilding(MapBuilding buildingToPlace, MapBuilding[] buildings, MapTile[] tiles)
        {   
            // Check for collisions with existing buildings
            foreach (MapBuilding building in buildings)
            {
                bool overlapX = (buildingToPlace.BottomLeftX + buildingToPlace.Building.BaseWidth > building.BottomLeftX) && (buildingToPlace.BottomLeftX < building.BottomLeftX + building.Building.BaseWidth);
                bool overlapY = (buildingToPlace.BottomLeftY + buildingToPlace.Building.BaseHeight > building.BottomLeftY) && (buildingToPlace.BottomLeftY < building.BottomLeftY + building.Building.BaseHeight);

                if (overlapX && overlapY) return false;
            }

            // Check if all tiles under the building are placeable
            for (int x = buildingToPlace.BottomLeftX; x < buildingToPlace.BottomLeftX + buildingToPlace.Building.BaseWidth; x++)
            {   
                for (int y = buildingToPlace.BottomLeftY - buildingToPlace.Building.BaseHeight; y <= buildingToPlace.BottomLeftY; y++)
                {
                    var tilesAtLocation = tiles.Where(t => t.X == x && t.Y == y).ToArray();

                    if (tilesAtLocation.Length == 0 || tilesAtLocation.Any(t => !t.Tile.IsPlaceable))
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        public static T[,] WriteRectTo2dArray<T>(T[,] array, int bottomLeftX, int bottomLeftY, int width, int height, T value)
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
    }
}