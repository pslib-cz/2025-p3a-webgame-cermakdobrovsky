import type { MapBuilding } from "../../../types/mapModels";
import useImage from "use-image";
import { Rect } from "react-konva";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
};
const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize }) => {
  const [buildingImage] = useImage(building.building.imageUrl);

  let scale = 1;
  let yOffset = 0;

  if (buildingImage) {
    const buildingWidth = tileSize * building.building.width;
    scale = buildingWidth / buildingImage.width;

    yOffset = building.building.height * tileSize - buildingImage.height * scale - (10);
    yOffset = -yOffset
  }

  return (
    <>
      <Rect
        x={building.bottomLeftX * tileSize}
        y={(building.bottomLeftY - building.building.height + 1) * tileSize}
        width={tileSize * building.building.width}
        height={tileSize * building.building.height}
        fillPatternImage={buildingImage}
        fillPatternScale={{ x: scale, y: scale }}
        fillPatternOffset={{ x: 0, y: yOffset }}
        fillPatternRepeat="no-repeat"
      />
    </>
  );
};
export default BuildingComponent;
