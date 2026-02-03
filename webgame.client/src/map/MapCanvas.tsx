import React, { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Tile, Building as BuildingComponent, SpriteAnimation } from "../components";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import type { Map, Building, MapBuilding } from "../../types/mapModels";
import { getDecorationsForMap } from "../../lib/helpers/mapDecorations";

type MapCanvasProps = {
  groundMap: Map;
  buildingsMap: Map;
  tileSize?: number;
  placingBuilding?: Building | null;
  onMapClick?: (x: number, y: number) => void;
  onBuildingClick?: (building: MapBuilding) => void;
};
const MapCanvas: React.FC<MapCanvasProps> = ({ groundMap, buildingsMap, onMapClick, tileSize = 64, placingBuilding = null, onBuildingClick }) => {
  //Hooks
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const decorations = useMemo(() => {
    return getDecorationsForMap(groundMap, buildingsMap, tileSize);
  }, [groundMap, buildingsMap, tileSize]);
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
  return (
    <div ref={containerRef} style={{ width: "100svw", height: "100svh", overflow: "hidden" }}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable
        onWheel={handleWheel}
        onMouseMove={() => {
          if (!placingBuilding) {
            if (hoverPosition) setHoverPosition(null);
            return;
          }
          const stage = stageRef.current;
          if (!stage) return;
          const pointerPosition = stage.getPointerPosition();
          if (!pointerPosition) return;
          const scale = stage.scaleX();
          const x = Math.floor((pointerPosition.x - stage.x()) / scale / tileSize);
          const y = Math.floor((pointerPosition.y - stage.y()) / scale / tileSize);
          setHoverPosition({ x, y });
        }}
        onClick={() => {
          if (!onMapClick) return;
          const stage = stageRef.current;
          if (!stage) return;
          const pointerPosition = stage.getPointerPosition();
          if (!pointerPosition) return;
          const scale = stage.scaleX();
          const x = Math.floor((pointerPosition.x - stage.x()) / scale / tileSize);
          const y = Math.floor((pointerPosition.y - stage.y()) / scale / tileSize);
          onMapClick(x, y);
        }}
      >
        <Layer>
          {groundMap.tiles.map((tile, index) => (
            <Tile key={`tile-${index}`} tile={tile} tileSize={tileSize} />
          ))}
          {decorations.map((deco) => (
            <SpriteAnimation
              key={deco.id}
              src={deco.config.src}
              frameWidth={deco.config.frameWidth}
              frameHeight={deco.config.frameHeight}
              columns={deco.config.columns}
              rows={deco.config.rows}
              frameRate={deco.config.frameRate}
              loop={true}
              autoplay={true}
              x={deco.pixelX}
              y={deco.pixelY}
              listening={false}
            />
          ))}
          <SpriteAnimation
            src="/images/sprite-animations/rock-1.png"
            frameWidth={128}
            frameHeight={128}
            columns={8}
            rows={1}
            frameRate={8}
            loop={true}
            autoplay={true}
            x={1300}
            y={1350}
            listening={false}
          />
          <SpriteAnimation
            src="/images/sprite-animations/rock-1.png"
            frameWidth={128}
            frameHeight={128}
            columns={8}
            rows={1}
            frameRate={8}
            loop={true}
            autoplay={true}
            x={2000}
            y={1475}
            listening={false}
          />
          <SpriteAnimation
            src="/images/sprite-animations/rock-2.png"
            frameWidth={128}
            frameHeight={128}
            columns={8}
            rows={1}
            frameRate={8}
            loop={true}
            autoplay={true}
            x={2100}
            y={1200}
            listening={false}
          />
          {buildingsMap.buildings.map((building, index) => (
            <BuildingComponent transparentOnHover={!!placingBuilding} key={`building-${index}`} building={building} tileSize={tileSize} onClick={onBuildingClick} />
          ))}
          {placingBuilding && hoverPosition && (
            <>
              <BuildingComponent
                building={
                  {
                    building: placingBuilding,
                    buildingId: -1,
                    mapId: -1,
                    bottomLeftX: hoverPosition.x,
                    bottomLeftY: hoverPosition.y,
                  } as MapBuilding
                }
                tileSize={tileSize}
                transparentOnHover={false}
                opacity={0.7}
                listening={false}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};
export default MapCanvas;