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

  if (buildingImage) {
    const buildingWidth = tileSize * building.building.width;
    const buildingHeight = tileSize * building.building.height;
    scale = Math.min(buildingWidth / buildingImage.width, buildingHeight / buildingImage.height);
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
        fillPatternRepeat="no-repeat"
      />
    </>
  );
};
export default BuildingComponent;