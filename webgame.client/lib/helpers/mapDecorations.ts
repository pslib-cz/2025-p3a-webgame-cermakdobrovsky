import type { Map } from "../../types/mapModels";

export interface DecorationConfig {
    type: string;
    src: string;
    frameWidth: number;
    frameHeight: number;
    columns: number;
    rows: number;
    frameRate: number;
    probability: number; // 0 to 1 chance to spawn on a valid tile
    // Offset relative to the tile's top-left corner to align the sprite
    offsetX: number;
    offsetY: number;
}

export const DECORATIONS: DecorationConfig[] = [
    {
        type: 'sheep',
        src: '/images/sprite-animations/sheep.png',
        frameWidth: 128,
        frameHeight: 128,
        columns: 12,
        rows: 1,
        frameRate: 8,
        probability: 0.005, // Rare
        offsetX: -37, // (128 - 54) / 2 = 37. Centered horizontally.
        offsetY: -74, // Align bottom somewhat? 128 is tall. Tile is 54. 54 - 128 = -74.
    },
    {
        type: 'bush-1',
        src: '/images/sprite-animations/bushe-1.png',
        frameWidth: 128,
        frameHeight: 128,
        columns: 8,
        rows: 1,
        frameRate: 8,
        probability: 0.02,
        offsetX: -37,
        offsetY: -74,
    },
    {
        type: 'bush-2',
        src: '/images/sprite-animations/bushe-2.png',
        frameWidth: 128,
        frameHeight: 128,
        columns: 8,
        rows: 1,
        frameRate: 8,
        probability: 0.02,
        offsetX: -37,
        offsetY: -74,
    },
    {
        type: 'tree-1',
        src: '/images/sprite-animations/tree-1.png',
        frameWidth: 192,
        frameHeight: 256,
        columns: 8,
        rows: 1,
        frameRate: 8,
        probability: 0.01,
        offsetX: -69,
        offsetY: -202,
    },
    {
        type: 'tree-2',
        src: '/images/sprite-animations/tree-2.png',
        frameWidth: 192,
        frameHeight: 256,
        columns: 8,
        rows: 1,
        frameRate: 8,
        probability: 0.01,
        offsetX: -69,
        offsetY: -202,
    }
];

// Simple deterministic hash function
function hash(x: number, y: number, seed: number = 0): number {
    let h = 0x811c9dc5;
    h ^= x;
    h = Math.imul(h, 0x01000193);
    h ^= y;
    h = Math.imul(h, 0x01000193);
    h ^= seed;
    h = Math.imul(h, 0x01000193);
    return (h >>> 0) / 4294967296;
}



export type DecorationInstance = {
    id: string;
    config: DecorationConfig;
    x: number;
    y: number;
    pixelX: number;
    pixelY: number;
}

// Helper to get decoration config by type
function getConfig(type: string): DecorationConfig | undefined {
    return DECORATIONS.find(d => d.type === type);
}

export function getDecorationsForMap(groundMap: Map, buildingsMap: Map, tileSize: number): DecorationInstance[] {
    const decorations: DecorationInstance[] = [];
    const occupiedTiles = new Set<string>();

    // 1. Mark building tiles as occupied
    buildingsMap.buildings.forEach(b => {
        for (let dx = 0; dx < b.building.baseWidth; dx++) {
            for (let dy = 0; dy < b.building.baseHeight; dy++) {
                const tileX = b.bottomLeftX + dx;
                const tileY = b.bottomLeftY - b.building.baseHeight + 1 + dy;
                occupiedTiles.add(`${tileX},${tileY}`);
            }
        }
    });

    // Optimization: Build a Set of VALID Placeable keys and find bounds
    const validPlaceableTiles = new Set<string>();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    groundMap.tiles.forEach(t => {
        if (t.x < minX) minX = t.x;
        if (t.x > maxX) maxX = t.x;
        if (t.y < minY) minY = t.y;
        if (t.y > maxY) maxY = t.y;

        if (t.tile.isPlaceable) {
            validPlaceableTiles.add(`${t.x},${t.y}`);
        }
    });

    // Safety check if map is empty
    if (minX === Infinity) return [];

    const mapWidth = maxX - minX + 1;
    const mapHeight = maxY - minY + 1;

    const isAvailable = (x: number, y: number) => {
        const key = `${x},${y}`;
        return validPlaceableTiles.has(key) && !occupiedTiles.has(key);
    };

    // 2. Groups Definition
    const GROUPS = [
        [
            { type: 'bush-1', dx: 0, dy: 0 },
            { type: 'tree-1', dx: 0, dy: 0 },
            { type: 'tree-2', dx: 1, dy: 1 },
        ],
        [
            { type: 'bush-1', dx: 0, dy: 0 },
            { type: 'tree-2', dx: 0, dy: 0 },
        ],
        [
            { type: 'bush-2', dx: 0, dy: 0 },
            { type: 'tree-1', dx: 0, dy: 0 },
        ]
    ];

    // 3. Grid Logic (4x4 = 16 sectors)
    const SECTORS_X = 4;
    const SECTORS_Y = 4;
    const sectorW = Math.ceil(mapWidth / SECTORS_X);
    const sectorH = Math.ceil(mapHeight / SECTORS_Y);

    for (let sx = 0; sx < SECTORS_X; sx++) {
        for (let sy = 0; sy < SECTORS_Y; sy++) {
            // Define sector bounds
            const sMinX = minX + sx * sectorW;
            const sMinY = minY + sy * sectorH;

            // Try to place ONE group in this sector
            // We give it a few tries to find a valid spot
            let placed = false;
            for (let attempt = 0; attempt < 50; attempt++) {
                if (placed) break;

                // Deterministic random position within sector
                // Seed based on sector + attempt
                const r1 = hash(sx, sy, attempt * 111);
                const r2 = hash(sx, sy, attempt * 222 + 7);

                const tx = sMinX + Math.floor(r1 * sectorW);
                const ty = sMinY + Math.floor(r2 * sectorH);

                // Check bounds (redundant if logic is correct but good for safety)
                if (tx > maxX || ty > maxY) continue;
                // Quick check if seed is even valid
                if (!validPlaceableTiles.has(`${tx},${ty}`)) continue;

                // Pick random group variant
                const grpIdx = Math.floor(hash(tx, ty, 333) * GROUPS.length);
                const group = GROUPS[grpIdx];

                // Check entire group validity
                let canPlace = true;
                for (const item of group) {
                    if (!isAvailable(tx + item.dx, ty + item.dy)) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    // Place it
                    for (const item of group) {
                        const config = getConfig(item.type);
                        if (!config) continue;

                        const finalX = tx + item.dx;
                        const finalY = ty + item.dy;

                        decorations.push({
                            id: `deco-grp-${sx}-${sy}-${finalX}-${finalY}`,
                            config,
                            x: finalX,
                            y: finalY,
                            pixelX: finalX * tileSize + config.offsetX,
                            pixelY: finalY * tileSize + config.offsetY
                        });
                        occupiedTiles.add(`${finalX},${finalY}`);
                    }
                    placed = true; // Stop after placing one in this sector
                }
            }
        }
    }

    // 4. Random Sheep (Separate pass)
    groundMap.tiles.forEach(tile => {
        if (!isAvailable(tile.x, tile.y)) return;

        const h = hash(tile.x, tile.y, 777);
        if (h < 0.005) { // 0.5% chance for sheep
            const config = getConfig('sheep');
            if (config) {
                decorations.push({
                    id: `deco-sheep-${tile.x}-${tile.y}`,
                    config,
                    x: tile.x,
                    y: tile.y,
                    pixelX: tile.x * tileSize + config.offsetX,
                    pixelY: tile.y * tileSize + config.offsetY
                });
                occupiedTiles.add(`${tile.x},${tile.y}`);
            }
        }
    });

    return decorations;
}