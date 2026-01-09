import type { MapTile } from "../../types/mapModels";
import { Rect, Text } from "react-konva";

type TileProps = {
  tile: MapTile;
  tileSize: number;
};

const TileComponent: React.FC<TileProps> = ({ tile, tileSize }) => {
  return (
    <>
      <Rect x={tile.x * tileSize} y={tile.y * tileSize} width={tileSize} height={tileSize} fill={tile.tile.isPlaceable ? "#90EE90" : "#D3D3D3"} stroke="#333" strokeWidth={1} />
      <Text
        x={tile.x * tileSize}
        y={tile.y * tileSize}
        width={tileSize}
        height={tileSize}
        text={"x: " + tile.x + ", y: " + tile.y}
        fontSize={12}
        fontFamily="Arial"
        fill="#000"
        align="center"
        verticalAlign="middle"
      />
    </>
  );
};

export default TileComponent;
