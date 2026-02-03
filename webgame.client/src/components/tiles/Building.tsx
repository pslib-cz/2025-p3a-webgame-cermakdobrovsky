import type { MapBuilding } from "../../../types/mapModels";
import useImage from "use-image";
import { Image as KonvaImage, Rect } from "react-konva";
import { useEffect, useRef, useState, useMemo } from "react";
import Konva from "konva";
import { useDebugMode } from "../../hooks/useDebugMode";
import { getBuildingImageUrl } from "../../../helpers/randomImage";

type buildingProps = {
  building: MapBuilding;
  tileSize: number;
  transparentOnHover?: boolean;
  opacity?: number;
  listening?: boolean;
  onClick?: (building: MapBuilding) => void;
};
const BuildingComponent: React.FC<buildingProps> = ({ building, tileSize, transparentOnHover = false, opacity, listening = true, onClick }) => {
  //Hooks
  const finalIds = useMemo(() => {
    return getBuildingImageUrl(building.building.imageUrl, building.bottomLeftX, building.bottomLeftY);
  }, [building.building.imageUrl, building.bottomLeftX, building.bottomLeftY]);
  const [buildingImage] = useImage(finalIds);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<Konva.Image>(null);
  const { debugMode } = useDebugMode();

  useEffect(() => {
    if (imageRef.current) {
      if (opacity !== undefined) {
        imageRef.current.opacity(opacity);
      } else {
        imageRef.current.to({
          opacity: transparentOnHover && isHovered ? 0.2 : 1,
          duration: 0.1,
        });
      }
    }
  }, [isHovered, transparentOnHover, opacity]);
  if (!buildingImage) return null;
  const buildingWidth = tileSize * building.building.width;
  const scale = buildingWidth / buildingImage.width;
  const rectY = (building.bottomLeftY - building.building.height + 1) * tileSize;
  const rectHeight = tileSize * building.building.height;
  const imageHeight = buildingImage.height * scale;
  return (
    <>
      {debugMode && <>
        <Rect x={building.bottomLeftX * tileSize} y={rectY} width={buildingWidth} height={rectHeight} fill="blue" opacity={0.5} />
        <Rect x={building.bottomLeftX * tileSize} y={(building.bottomLeftY - building.building.baseHeight + 1) * tileSize} width={tileSize * building.building.baseWidth} height={tileSize * building.building.baseHeight} fill="green" opacity={0.5} />
      </>}
      <KonvaImage
        ref={imageRef}
        image={buildingImage}
        listening={listening}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        x={building.bottomLeftX * tileSize}
        y={rectY + rectHeight - imageHeight - 10}
        width={buildingWidth}
        height={imageHeight}
        onClick={() => onClick?.(building)}
      />
    </>
  );
};
export default BuildingComponent;