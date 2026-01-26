import type { MapBuilding } from "../../../types/mapModels";
import useImage from "use-image";
import { Rect } from "react-konva";
import { useState } from "react";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
  transparentOnHover?: boolean;
};
const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize, transparentOnHover = false }) => {
  const [buildingImage] = useImage(building.building.imageUrl);
  const [isHovered, setIsHovered] = useState(false);

  let scale = 1;
  let yOffset = 0;

  if (buildingImage) {
    const buildingWidth = tileSize * building.building.width;
    scale = buildingWidth / buildingImage.width;

    yOffset = building.building.height * tileSize - buildingImage.height * scale - 10;
    yOffset = -yOffset;
  }

  return (
    <>
      <Rect
        opacity={transparentOnHover && isHovered ? 0.5 : 1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
