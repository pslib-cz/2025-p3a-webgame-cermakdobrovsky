import type { MapBuilding } from "../../types/mapModels";
import { Text } from "react-konva";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
};

const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize }) => {
  // const [buildingImage] = useImage(building.building.imageUrl);

  return (
    <>
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
