import type { Tile } from "../../types/mapModels";

type GroundTileProps = {
  tile: Tile;
};

const GroundTile: React.FC<GroundTileProps> = ({ tile }) => {
  return (
    <div>
      <p>tileId: {tile.TileId}</p>
      <p>isPlaceable: {tile.IsPlaceable ? "true" : "false"}</p>
      <p>imageUrl: {tile.ImageUrl}</p>
    </div>
  );
};

export default GroundTile;
