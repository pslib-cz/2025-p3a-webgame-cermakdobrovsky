import useImage from "use-image";
import type { MapTile } from "../../types/mapModels";
import { Rect } from "react-konva";

type TileProps = {
  tile: MapTile;
  tileSize: number;
};
const TileComponent: React.FC<TileProps> = ({ tile, tileSize }) => {
  //Hooks
  const [tileImage] = useImage(tile.tile.imageUrl);
  return (
    <>
      <Rect
        x={tile.x * tileSize}
        y={tile.y * tileSize}
        width={tileSize}
        height={tileSize}
        fillPatternImage={tileImage}
        fillPatternScale={{ x: 1, y: 1 }}
        fillPatternRepeat="no-repeat"
      />
    </>
  );
};
export default TileComponent;