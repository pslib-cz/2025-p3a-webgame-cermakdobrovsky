export type Tile = {
  tileId: string;
  isPlaceable: boolean;
  imageUrl: string;
};

export type Building = {
  buildingId: number;
  name: string;
  description: string;
  resourceId: number | null;
  resource: Resource | null;
  isTownHall: boolean;
  initialCost: number;
  height: number;
  width: number;
  levels: BuildingLevel[];
};

export type BuildingLevel = {
  buildingLevelId: number;
  buildingId: number;
  level: number;
  productionRate: number;
  upgradeCost: number;
};

export type Resource = {
  resourceId: number;
  name: string;
  description: string;
};

export type MapBuilding = {
  buildingId: number;
  building: Building;
  mapId: number;
  topLeftX: number;
  topLeftY: number;
};

export type MapTile = {
  tileId: number;
  tile: Tile;
  mapId: number;
  x: number;
  y: number;
};

export type Map = {
  mapId: number;
  title: string;
  buildings: MapBuilding[];
  tiles: MapTile[];
};