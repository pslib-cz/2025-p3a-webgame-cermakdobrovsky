import { type FC, useEffect, useState } from "react";
import { Building as BuildingComponent } from "../../components";
import SpriteAnimation from "../sprite-animations/SpriteAnimation";
import { type MapBuilding } from "../../../types/mapModels";

type DestructionEffectProps = {
    building: MapBuilding;
    tileSize: number;
    onComplete: () => void;
};
const DestructionEffect: FC<DestructionEffectProps> = ({ building, tileSize, onComplete }) => {
    //Hooks
    const [explosionStages, setExplosionStages] = useState<number[]>([]);
    const [opacity, setOpacity] = useState<number>(1);

    useEffect(() => {
        const fadeDuration = 750;
        const steps = 30;
        const intervalTime = fadeDuration / steps;
        const fadeInterval = setInterval(() => {
            setOpacity(prev => Math.max(0, prev - (1 / steps)));
        }, intervalTime);
        const schedule = [
            { delay: 0, id: 0 },
            { delay: 100, id: 1 },
            { delay: 200, id: 2 },
            { delay: 300, id: 3 },
        ];
        const timers: number[] = [];
        schedule.forEach(item => {
            const t = setTimeout(() => {
                setExplosionStages(prev => [...prev, item.id]);
            }, item.delay);
            timers.push(t);
        });
        const cleanup = setTimeout(() => {
            onComplete();
        }, 750);
        return () => {
            clearInterval(fadeInterval);
            timers.forEach(clearTimeout);
            clearTimeout(cleanup);
        };
    }, [onComplete]);
    const baseX = building.bottomLeftX * tileSize;
    const baseY = (building.bottomLeftY - building.building.baseHeight + 1) * tileSize;
    const centerX = baseX + (building.building.baseWidth * tileSize) / 2;
    const centerY = baseY + (building.building.baseHeight * tileSize) / 2;
    const offsets = [
        { x: 0, y: 0, scale: 1 },
        { x: -30, y: -30, scale: 0.8 },
        { x: 30, y: 30, scale: 0.8 },
        { x: 0, y: 0, scale: 1.2 },
    ];
    return (
        <>
            <BuildingComponent
                building={building}
                tileSize={tileSize}
                listening={false}
                opacity={opacity}
                transparentOnHover={false}
            />
            {explosionStages.map(stageId => {
                const config = offsets[stageId];
                const explX = centerX + config.x - (192 / 2);
                const explY = centerY + config.y - (192 / 2);
                return (
                    <SpriteAnimation
                        key={`expl-${stageId}`}
                        src="/images/sprite-animations/explosion-1.png"
                        frameWidth={192}
                        frameHeight={192}
                        columns={8}
                        rows={1}
                        frameRate={8}
                        loop={false}
                        autoplay={true}
                        x={explX}
                        y={explY}
                        scaleX={config.scale}
                        scaleY={config.scale}
                    />
                );
            })}
        </>
    );
};
export default DestructionEffect;