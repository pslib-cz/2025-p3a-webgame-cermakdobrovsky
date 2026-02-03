import type { Map } from "./mapModels";

export type GameState = {
  playerId: string;
  sheep: number;
  population: number;
  freeSpace: number;
  maxPopulation: number;
  lastUpdated: string;
  buildingMapId: number;
  buildingMap: Map;
};
