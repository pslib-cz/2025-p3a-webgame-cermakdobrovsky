import type { MapBuilding } from "../../types/mapModels";
import useImage from "use-image";
import { Text, Rect } from "react-konva";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
};

const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize }) => {
  const [buildingImage] = useImage(building.building.imageUrl);

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (buildingImage) {
    scale = Math.min(tileSize / buildingImage.width, tileSize / buildingImage.height);
    offsetX = (tileSize - buildingImage.width * scale) / 2;
    offsetY = (tileSize - buildingImage.height * scale) / 2;
  }

  return (
    <>
      <Rect
        x={building.topLeftX * tileSize}
        y={building.topLeftY * tileSize}
        width={tileSize * building.building.width}
        height={tileSize * building.building.height}
        fillPatternImage={buildingImage}
        fillPatternScale={{ x: scale, y: scale }}
        fillPatternOffset={{ x: -offsetX / scale, y: -offsetY / scale }}
        fillPatternRepeat="no-repeat"
      />
      <Text
        text={`x: ${building.topLeftX}\ny: ${building.topLeftY}\n${building.building.width}x${building.building.height}`}
        fontSize={12}
        x={building.topLeftX * tileSize}
        y={building.topLeftY * tileSize}
        fill="white"
        shadowColor="black"
        shadowBlur={2}
        padding={5}
        width={tileSize}
        align="center"
        verticalAlign="middle"
        height={tileSize}
        listening={false}
      />
    </>
  );
};

export default BuildingComponent;
