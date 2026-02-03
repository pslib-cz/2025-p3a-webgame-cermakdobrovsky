import { use, useState, useRef, useEffect } from "react";
import type { GameState } from "./../types/gameModels";
import type { Building, Map, MapBuilding, MapBuildingDTO } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./styles/global.css";
import { Button, Resource, TownHallLevel, Shop, BuildingMenu } from "./components";
import { useDebugMode } from "./hooks/useDebugMode";

//Promises
const groundMapPromise: Promise<Map> = fetch("/api/map/ground").then((res) => res.json());

const buildingsPromise: Promise<Building[]> = fetch("/api/map/buildings").then((res) => res.json());

const playerIdPromise: Promise<string> = (async () => {
  const storedId = localStorage.getItem("playerId");
  if (storedId) return storedId;
  const res = await fetch("/api/game/create");
  if (!res.ok) {
    throw new Error("Failed to create player ID");
  }
  const newId = await res.text();
  localStorage.setItem("playerId", newId);
  return newId;
})();

const gameStatePromise: Promise<GameState> = playerIdPromise.then(async (playerId) => {
  let res = await fetch(`/api/game/state/${playerId}`);
  if (!res.ok) {
    await fetch(`/api/game/create/?playerId=${playerId}`);
    res = await fetch(`/api/game/state/${playerId}`);
  }
  const data = await res.json();
  return data;
});

const App = () => {
  //Hooks
  const groundMap: Map = use<Map>(groundMapPromise);
  const initialGameState: GameState = use<GameState>(gameStatePromise);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const buildings: Building[] = use<Building[]>(buildingsPromise);
  const [isOpenShop, setIsOpenShop] = useState<boolean>(false);
  const [placingBuilding, setPlacingBuilding] = useState<Building | null>(null);
  const [currentBuilding, setCurrentBuilding] = useState<MapBuilding | null>(null);
  const shopButtonRef = useRef<HTMLLIElement>(null);
  const { debugMode, toggleDebugMode } = useDebugMode();

  // Advance game every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (gameState?.playerId) {
        const response = await fetch(`/api/game/advance/${gameState.playerId}`);
        if (response.ok) {
          const updatedState = await response.json();
          setGameState(updatedState);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState?.playerId]);

  const addBuilding = async (buildingId: number, bottomLeftX: number, bottomLeftY: number) => {
    const buildingToPlace: MapBuildingDTO = {
      playerId: gameState.playerId,
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
      return;
    }
    const data = await response.json();
    setGameState(data);
  };

  const deleteBuilding = async (mapBuilding: MapBuilding) => {
    const { mapId, bottomLeftX, bottomLeftY } = mapBuilding;
    const response = await fetch(`/api/map/building/${mapId}/${bottomLeftX}/${bottomLeftY}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      alert(errorMessage);
      return;
    }
    setGameState((prev) => ({
      ...prev,
      buildingMap: { ...prev.buildingMap, buildings: prev.buildingMap.buildings.filter((b) => !(b.mapId === mapId && b.bottomLeftX === bottomLeftX && b.bottomLeftY === bottomLeftY)) },
    }));
    setCurrentBuilding(null);
  };

  return (
    <>
      <button
        onClick={toggleDebugMode}
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          zIndex: 9999,
          padding: "8px 12px",
          background: debugMode ? "#4CAF50" : "#666",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Debug: {debugMode ? "ON" : "OFF"}
      </button>
      <div className="page">
        <div className="page__townhall-level">
          <TownHallLevel currentLevel={6} />
        </div>
        <Shop
          isOpen={isOpenShop}
          buildings={buildings}
          onClose={() => setIsOpenShop(false)}
          onBuildingBuy={(building) => {
            setPlacingBuilding(building);
            setIsOpenShop(false);
          }}
        />
        <BuildingMenu onDeleteBuilding={deleteBuilding} isOpen={currentBuilding !== null} building={currentBuilding ?? undefined} onClose={() => setCurrentBuilding(null)} />
        <ul className="page__resources-area">
          <li>
            <Resource maxWidth="300px" imgSrc="images/content/sheep.png" color="#9B7260" currentAmount={gameState.sheep} />
          </li>
          <li>
            <Resource maxWidth="250px" imgSrc="images/content/mong.png" color="#4795A7" currentAmount={gameState.population} />
          </li>
          <li>
            <Resource maxWidth="200px" imgSrc="images/content/grass.png" color="#455A4B" currentAmount={gameState.freeSpace} />
          </li>
        </ul>
        <ul className="page__buttons-area">
          {placingBuilding ? (
            <li>
              <Button onClick={() => setPlacingBuilding(null)} variant="secondary" imgSrc="images/content/house.png">
                Zrušit
              </Button>
            </li>
          ) : (
            <>
              <li>
                <Button variant="secondary" imgSrc="images/content/warrior.png">
                  Útok
                </Button>
              </li>
              <li ref={shopButtonRef}>
                <Button onClick={() => setIsOpenShop(true)} variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">
                  Stavět
                </Button>
              </li>
            </>
          )}
        </ul>
        {gameState && (
          <MapCanvas
            groundMap={groundMap}
            buildingsMap={gameState.buildingMap}
            tileSize={54}
            placingBuilding={placingBuilding}
            onMapClick={(x, y) => {
              if (placingBuilding !== null) {
                addBuilding(placingBuilding.buildingId, x, y);
                setPlacingBuilding(null);
              }
            }}
            onBuildingClick={(building) => {
              if (placingBuilding === null) setCurrentBuilding(building);
            }}
          />
        )}
      </div>
    </>
  );
};
export default App;
