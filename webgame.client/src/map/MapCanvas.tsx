import React, { useRef, useState, useLayoutEffect } from "react";
import TileComponent from "../Components/Tile";
import BuildingComponent from "../Components/Building";
import { Stage, Layer } from "react-konva";
import type { Map } from "../../types/mapModels";

type MapCanvasProps = {
  groundMap: Map;
  buildingsMap: Map;
  tileSize?: number;
};
const MapCanvas: React.FC<MapCanvasProps> = ({ groundMap, buildingsMap, tileSize = 64 }) => {
  const stageRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

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
    <div ref={containerRef} style={{ width: "100dvw", height: "100dvh", cursor: "grab" }}>
      <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} draggable>
        <Layer>
          {groundMap.tiles.map((tile, index) => (
            <TileComponent key={index} tile={tile} tileSize={tileSize} />
          ))}
          {buildingsMap.buildings.map((building, index) => (
            <BuildingComponent key={index} building={building} tileSize={tileSize} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
export default MapCanvas;
