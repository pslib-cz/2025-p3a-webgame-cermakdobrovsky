import { useMemo } from "react";
import type { Map } from "../../types/mapModels";
import { getDecorationsForMap } from "../../lib/helpers/mapDecorations";

export const useMapDecorations = (groundMap: Map, buildingsMap: Map, tileSize: number) => {
    const decorations = useMemo(() => {
        return getDecorationsForMap(groundMap, buildingsMap, tileSize);
    }, [groundMap, buildingsMap, tileSize]);
    const foamPositions = useMemo(() => {
        const tileSet = new Set(groundMap.tiles.map((t) => `${t.x},${t.y}`));
        const foam: { id: string; pixelX: number; pixelY: number; sortY: number }[] = [];
        let foamIndex = 0;
        groundMap.tiles.forEach((tile) => {
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
                foam.push({
                    id: `foam-${foamIndex++}`,
                    pixelX: foamX + tileSize / 2 - 192 / 2 - offsetX,
                    pixelY: foamY + tileSize / 2 - 192 / 2 - offsetY,
                    sortY: (tile.y + 1) * tileSize - 1,
                });
            }
        });
        return foam;
    }, [groundMap, tileSize]);
    return { decorations, foamPositions };
};