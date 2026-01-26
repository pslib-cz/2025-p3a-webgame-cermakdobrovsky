import type { MapBuilding } from "../../../types/mapModels";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
  transparentOnHover?: boolean;
};
const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize, transparentOnHover = false }) => {
  const [buildingImage] = useImage(building.building.imageUrl);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.to({
        opacity: transparentOnHover && isHovered ? 0.2 : 1,
        duration: 0.1,
      });
    }
  }, [isHovered, transparentOnHover]);

  if (!buildingImage) return null;

  const buildingWidth = tileSize * building.building.width;
  const scale = buildingWidth / buildingImage.width;

  const rectY = (building.bottomLeftY - building.building.height + 1) * tileSize;
  const rectHeight = tileSize * building.building.height;
  const imageHeight = buildingImage.height * scale;

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={buildingImage}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        x={building.bottomLeftX * tileSize}
        y={rectY + rectHeight - imageHeight - 10}
        width={buildingWidth}
        height={imageHeight}
      />
    </>
  );
};
export default BuildingComponent;
