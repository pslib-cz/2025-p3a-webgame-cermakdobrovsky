import useImage from "use-image";
import type { MapTile } from "../../types/mapModels";
import { Rect } from "react-konva";

type TileProps = {
  tile: MapTile;
  tileSize: number;
};
const TileComponent: React.FC<TileProps> = ({ tile, tileSize }) => {
  const [tileImage] = useImage(tile.tile.imageUrl);

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (tileImage) {
    scale = Math.min(tileSize / tileImage.width, tileSize / tileImage.height);
    offsetX = (tileSize - tileImage.width * scale) / 2;
    offsetY = (tileSize - tileImage.height * scale) / 2;
  }

  return (
    <Rect
      x={tile.x * tileSize}
      y={tile.y * tileSize}
      width={tileSize}
      height={tileSize}
      fillPatternImage={tileImage}
      fillPatternScale={{ x: scale, y: scale }}
      fillPatternOffset={{ x: -offsetX / scale, y: -offsetY / scale }}
      fillPatternRepeat="no-repeat"
    />
  );
};

export default TileComponent;
