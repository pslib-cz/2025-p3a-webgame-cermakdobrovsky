import type { Building, Map, MapBuilding, MapBuildingDTO } from "./../types/mapModels";
import type { GameState } from "./../types/gameModels";

export const groundMapPromise: Promise<Map> = fetch("/api/map/ground").then((res) => res.json());

export const buildingsPromise: Promise<Building[]> = fetch("/api/map/buildings").then((res) => res.json());

export const addBuilding = async (buildingId: number, bottomLeftX: number, bottomLeftY: number, playerId: string): Promise<GameState | null> => {
  const buildingToPlace: MapBuildingDTO = {
    playerId: playerId,
    buildingId: buildingId,
    bottomLeftX: bottomLeftX,
    bottomLeftY: bottomLeftY,
  };
  const response = await fetch("/api/map/building", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildingToPlace),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    alert(errorMessage);
    return null;
  }
  const data: GameState = await response.json();
  return data;
};

export const deleteBuilding = async (mapBuilding: MapBuilding, gameState: GameState): Promise<GameState | null> => {
  const { mapId, bottomLeftX, bottomLeftY } = mapBuilding;
  const response = await fetch(`/api/map/building/${mapId}/${bottomLeftX}/${bottomLeftY}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    alert(errorMessage);
    return null;
  }
  const data: GameState = await response.json();
  return data;
};
