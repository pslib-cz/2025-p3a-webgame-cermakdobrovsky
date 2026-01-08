export type Tile = {
  TileId: string;
  IsPlaceable: boolean;
  ImageUrl: string;
};

export type Building = {
  BuildingId: number;
  Name: string;
  Description: string;
  ResourceId: number | null;
  Resource: Resource | null;
  IsTownHall: boolean;
  InitialCost: number;
  Height: number;
  Width: number;
  Levels: BuildingLevel[];
};

export type BuildingLevel = {
  BuildingLevelId: number;
  BuildingId: number;
  Level: number;
  ProductionRate: number;
  UpgradeCost: number;
};

export type Resource = {
  ResourceId: number;
  Name: string;
  Description: string;
};

export type MapBuilding = {
  BuildingId: number;
  Building: Building;
  MapId: number;
  TopLeftX: number;
  TopLeftY: number;
};

export type MapTile = {
  TileId: number;
  Tile: Tile;
  MapId: number;
  X: number;
  Y: number;
};

export type Map = {
  MapId: number;
  Title: string;
  Buildings: MapBuilding[];
  Tiles: MapTile[];
};
