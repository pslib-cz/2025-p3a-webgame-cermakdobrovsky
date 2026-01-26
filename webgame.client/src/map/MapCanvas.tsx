import React, { useRef, useState, useLayoutEffect } from "react";
import { Tile, Building as BuildingComponent } from "../components";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";
import type { Map, Building } from "../../types/mapModels";

type MapCanvasProps = {
  groundMap: Map;
  buildingsMap: Map;
  tileSize?: number;
  placingBuilding?: Building | null;
  onMapClick?: (x: number, y: number) => void;
};
const MapCanvas: React.FC<MapCanvasProps> = ({ groundMap, buildingsMap, tileSize = 64, placingBuilding = null, onMapClick }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const scaleBy = 1.1;
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.max(0.1, Math.min(newScale, 5));
    stage.scale({ x: limitedScale, y: limitedScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };
    stage.position(newPos);
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // Get pointer position relative to stage (account for zoom and pan)
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();

    if (pos) {
      const relativePos = transform.point(pos);
      setMousePos(relativePos);
    }
  };

  const handleClick = () => {
    const stage = stageRef.current;
    if (!stage) return;

    if (stage.isDragging()) return;

    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    if (pos) {
      const relativePos = transform.point(pos);
      const snappedX = Math.floor(relativePos.x / tileSize);
      const snappedY = Math.floor(relativePos.y / tileSize);

      if (onMapClick) {
        onMapClick(snappedX, snappedY);
      }
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const snappedX = Math.floor(mousePos.x / tileSize - 1);
  const snappedY = Math.floor(mousePos.y / tileSize + 1);

  return (
    <div ref={containerRef} style={{ width: "100svw", height: "100svh", overflow: "hidden" }}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={!placingBuilding}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTap={handleClick}
      >
        <Layer>
          {groundMap.tiles.map((tile, index) => (
            <Tile key={`tile-${index}`} tile={tile} tileSize={tileSize} />
          ))}
          {buildingsMap.buildings.map((building, index) => (
            <BuildingComponent transparentOnHover={placingBuilding !== null} key={`building-${index}`} building={building} tileSize={tileSize} />
          ))}
          {placingBuilding && (
            <Group opacity={0.7} listening={false}>
              <BuildingComponent
                building={{
                  buildingId: -1,
                  mapId: -1,
                  bottomLeftX: snappedX,
                  bottomLeftY: snappedY,
                  building: placingBuilding,
                }}
                tileSize={tileSize}
                transparentOnHover={false}
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
};
export default MapCanvas;
