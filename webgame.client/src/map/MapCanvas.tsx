import { type FC, useRef, useState, useLayoutEffect, useMemo } from "react";
import { Tile, Building as BuildingComponent, SpriteAnimation, DestructionEffect } from "../components";
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
const MapCanvas: FC<MapCanvasProps> = ({ groundMap, buildingsMap, onMapClick, tileSize = 64, placingBuilding = null, onBuildingClick }) => {
    //Hooks
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

    const decorations = useMemo(() => {
        return getDecorationsForMap(groundMap, buildingsMap, tileSize);
    }, [groundMap, buildingsMap, tileSize]);
    const foamPositions = useMemo(() => {
        const tileSet = new Set(groundMap.tiles.map(t => `${t.x},${t.y}`));
        const foamMap = new Map<string, { id: string, pixelX: number, pixelY: number, sortY: number }>();

        groundMap.tiles.forEach(tile => {
            const tileKey = `${tile.x},${tile.y}`;
            if (foamMap.has(tileKey)) return;

            const hasWest = tileSet.has(`${tile.x - 1},${tile.y}`);
            const hasEast = tileSet.has(`${tile.x + 1},${tile.y}`);
            const hasNorth = tileSet.has(`${tile.x},${tile.y - 1}`);
            const hasSouth = tileSet.has(`${tile.x},${tile.y + 1}`);
            const isCoastal = !hasWest || !hasEast || !hasNorth || !hasSouth;

            if (isCoastal) {
                const foamX = tile.x * tileSize;
                const foamY = tile.y * tileSize;
                let offsetX = 0;
                let offsetY = 0;
                const shift = 7.5;

                if (!hasWest) offsetX -= shift;
                if (!hasEast) offsetX += shift;
                if (!hasNorth) offsetY -= shift;
                if (!hasSouth) offsetY += shift;

                foamMap.set(tileKey, {
                    id: `foam-${tile.x}-${tile.y}`,
                    pixelX: foamX + (tileSize / 2) - (192 / 2) - offsetX,
                    pixelY: foamY + (tileSize / 2) - (192 / 2) - offsetY,
                    sortY: ((tile.y + 1) * tileSize) - 1
                });
            }
        });
        return Array.from(foamMap.values());
    }, [groundMap, tileSize]);
    const armyGroups: { src: string, frameWidth: number, frameHeight: number, columns: number, rows: number, frameRate: number, loop: boolean, autoplay: boolean, x: number, y: number, delay?: number }[][] = [
        [
            { src: "/images/sprite-animations/archer.png", frameWidth: 192, frameHeight: 256, columns: 6, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2150, y: 850, delay: 2000 },
            { src: "/images/sprite-animations/archer.png", frameWidth: 192, frameHeight: 256, columns: 6, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2200, y: 800, delay: 1000 },
        ],
        [
            { src: "/images/sprite-animations/archer-shoot.png", frameWidth: 192, frameHeight: 256, columns: 8, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2700, y: 200, delay: 3000 },
            { src: "/images/sprite-animations/archer-shoot.png", frameWidth: 192, frameHeight: 256, columns: 8, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2750, y: 250, delay: 500 },
        ],
        [
            { src: "/images/sprite-animations/lancer.png", frameWidth: 320, frameHeight: 320, columns: 12, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 1815, y: 1250, delay: 4000 },
        ],
        [
            { src: "/images/sprite-animations/lancer.png", frameWidth: 320, frameHeight: 320, columns: 12, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2600, y: 1100, delay: 2000 },
            { src: "/images/sprite-animations/lancer.png", frameWidth: 320, frameHeight: 320, columns: 12, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 2650, y: 1150, delay: 1000 },
        ],
        [
            { src: "/images/sprite-animations/lancer.png", frameWidth: 320, frameHeight: 320, columns: 12, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 1800, y: 400, delay: 1000 },
            { src: "/images/sprite-animations/lancer.png", frameWidth: 320, frameHeight: 320, columns: 12, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 1850, y: 350, delay: 2000 },
        ],
        [
            { src: "/images/sprite-animations/monk.png", frameWidth: 192, frameHeight: 256, columns: 6, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 400, y: 1050, delay: 1000 },
            { src: "/images/sprite-animations/monk.png", frameWidth: 192, frameHeight: 256, columns: 6, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 450, y: 1100, delay: 2000 },
            { src: "/images/sprite-animations/monk.png", frameWidth: 192, frameHeight: 256, columns: 6, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 500, y: 1100, delay: 3000 },
        ],
        [
            { src: "/images/sprite-animations/warrior.png", frameWidth: 192, frameHeight: 256, columns: 8, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 1445, y: 1315, delay: 1000 },
        ],
        [
            { src: "/images/sprite-animations/warrior.png", frameWidth: 192, frameHeight: 256, columns: 8, rows: 1, frameRate: 8, loop: true, autoplay: true, x: 500, y: 700, delay: 2000 },
        ]
    ];
    const rocks: { id: number, src: string, x: number, y: number }[] = [{ id: 1, src: "/images/sprite-animations/rock-1.png", x: 1300, y: 1350 }, { id: 2, src: "/images/sprite-animations/rock-1.png", x: 2000, y: 1475 }, { id: 3, src: "/images/sprite-animations/rock-2.png", x: 2100, y: 1200 }]
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
    const prevBuildingsRef = useRef<MapBuilding[]>(buildingsMap.buildings);
    const [explosions, setExplosions] = useState<{ id: string, building: MapBuilding }[]>([]);
    useLayoutEffect(() => {
        const prevBuildings = prevBuildingsRef.current;
        const currentBuildings = buildingsMap.buildings;
        const removed = prevBuildings.filter(pb => !currentBuildings.find(cb => cb.buildingId === pb.buildingId && cb.bottomLeftX === pb.bottomLeftX && cb.bottomLeftY === pb.bottomLeftY));
        if (removed.length > 0) {
            const newExplosions = removed.map(b => ({
                id: `expl-${Date.now()}-${Math.random()}`,
                building: b
            }));
            setExplosions(prev => [...prev, ...newExplosions]);
        }
        prevBuildingsRef.current = currentBuildings;
    }, [buildingsMap]);
    const removeExplosion = (id: string) => {
        setExplosions(prev => prev.filter(e => e.id !== id));
    };
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
                    {foamPositions.map((foam) => (
                        <SpriteAnimation
                            key={foam.id}
                            src="/images/sprite-animations/water-foam.png"
                            frameWidth={192}
                            frameHeight={192}
                            columns={16}
                            rows={1}
                            frameRate={8}
                            loop={true}
                            autoplay={true}
                            x={foam.pixelX}
                            y={foam.pixelY}
                            listening={false}
                        />
                    ))}
                    {groundMap.tiles.map((tile, index) => (
                        <Tile key={`tile-${index}`} tile={tile} tileSize={tileSize} />
                    ))}
                    {(() => {
                        type Renderable = {
                            id: string;
                            sortY: number;
                            node: React.ReactNode;
                        };
                        const renderables: Renderable[] = [];
                        decorations.forEach((deco, i) => {
                            const height = deco.config.frameHeight / deco.config.rows;
                            renderables.push({
                                id: `deco-${i}`,
                                sortY: deco.pixelY + height,
                                node: (
                                    <SpriteAnimation
                                        key={`deco-${i}`}
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
                                )
                            });
                        });
                        armyGroups.forEach((group, groupIdx) => {
                            const isGroupColliding = group.some(sprite => {
                                const spriteMinX = Math.floor(sprite.x / tileSize);
                                const spriteMaxX = Math.floor((sprite.x + sprite.frameWidth - 1) / tileSize);
                                const spriteMinY = Math.floor(sprite.y / tileSize);
                                const spriteMaxY = Math.floor((sprite.y + sprite.frameHeight - 1) / tileSize);
                                return buildingsMap.buildings.some(b => {
                                    const buildingMinX = b.bottomLeftX;
                                    const buildingMaxX = b.bottomLeftX + b.building.baseWidth - 1;
                                    const buildingMaxY = b.bottomLeftY;
                                    const buildingMinY = b.bottomLeftY - b.building.baseHeight + 1;
                                    const noOverlap =
                                        spriteMinX > buildingMaxX ||
                                        spriteMaxX < buildingMinX ||
                                        spriteMinY > buildingMaxY ||
                                        spriteMaxY < buildingMinY;
                                    return !noOverlap;
                                });
                            });
                            if (!isGroupColliding) {
                                group.forEach((sprite, i) => {
                                    const height = sprite.frameHeight / sprite.rows;
                                    renderables.push({
                                        id: `army-${groupIdx}-${i}`,
                                        sortY: sprite.y + height,
                                        node: (
                                            <SpriteAnimation
                                                key={`army-${groupIdx}-${i}`}
                                                src={sprite.src}
                                                frameWidth={sprite.frameWidth}
                                                frameHeight={sprite.frameHeight}
                                                columns={sprite.columns}
                                                rows={sprite.rows}
                                                frameRate={sprite.frameRate}
                                                loop={sprite.loop}
                                                autoplay={sprite.autoplay}
                                                x={sprite.x}
                                                y={sprite.y}
                                                delay={sprite.delay}
                                            />
                                        )
                                    });
                                });
                            }
                        });
                        rocks.forEach(rock => {
                            const width = 128;
                            const height = 128;
                            const spriteMinX = Math.floor(rock.x / tileSize);
                            const spriteMaxX = Math.floor((rock.x + width - 1) / tileSize);
                            const spriteMinY = Math.floor(rock.y / tileSize);
                            const spriteMaxY = Math.floor((rock.y + height - 1) / tileSize);
                            const isColliding = buildingsMap.buildings.some(b => {
                                const buildingMinX = b.bottomLeftX;
                                const buildingMaxX = b.bottomLeftX + b.building.baseWidth - 1;
                                const buildingMaxY = b.bottomLeftY;
                                const buildingMinY = b.bottomLeftY - b.building.baseHeight + 1;
                                const noOverlap =
                                    spriteMinX > buildingMaxX ||
                                    spriteMaxX < buildingMinX ||
                                    spriteMinY > buildingMaxY ||
                                    spriteMaxY < buildingMinY;
                                return !noOverlap;
                            });
                            if (!isColliding) {
                                renderables.push({
                                    id: `rock-${rock.id}`,
                                    sortY: rock.y + height,
                                    node: (
                                        <SpriteAnimation
                                            key={`rock-${rock.id}`}
                                            src={rock.src}
                                            frameWidth={width}
                                            frameHeight={height}
                                            columns={8}
                                            rows={1}
                                            frameRate={8}
                                            loop={true}
                                            autoplay={true}
                                            x={rock.x}
                                            y={rock.y}
                                            listening={false}
                                        />
                                    )
                                });
                            }
                        });
                        buildingsMap.buildings.forEach((building, index) => {
                            renderables.push({
                                id: `building-${index}`,
                                sortY: (building.bottomLeftY + 1) * tileSize,
                                node: (
                                    <BuildingComponent
                                        transparentOnHover={!!placingBuilding}
                                        key={`building-${index}`}
                                        building={building}
                                        tileSize={tileSize}
                                        onClick={onBuildingClick}
                                    />
                                )
                            });
                        });
                        explosions.forEach(expl => {
                            renderables.push({
                                id: expl.id,
                                sortY: (expl.building.bottomLeftY + 1) * tileSize + 100000,
                                node: (
                                    <DestructionEffect
                                        key={expl.id}
                                        building={expl.building}
                                        tileSize={tileSize}
                                        onComplete={() => removeExplosion(expl.id)}
                                    />
                                )
                            });
                        });
                        renderables.sort((a, b) => a.sortY - b.sortY);
                        return renderables.map(r => r.node);
                    })()}
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