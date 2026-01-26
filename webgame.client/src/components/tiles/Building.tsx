import type { MapBuilding } from "../../../types/mapModels";
import useImage from "use-image";
import { Rect } from "react-konva";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
  setIsOpenMenu?: (value: boolean) => void;
};
const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize, setIsOpenMenu }) => {
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
        // opacity={0.2}
        onClick={() => setIsOpenMenu && setIsOpenMenu(true)}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "pointer";
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "default";
          }
        }}
      />
    </>
  );
};
export default BuildingComponent;