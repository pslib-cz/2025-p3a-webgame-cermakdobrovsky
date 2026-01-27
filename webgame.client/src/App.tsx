import { use, useState, useRef, useEffect } from "react";
import type { GameState } from "./../types/gameModels";
import type { Building, Map, MapBuildingDTO } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./styles/global.css";
import { Button, Resource, TownHallLevel, Shop, BuildingMenu } from "./components";

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
  const [isOpenBuildingMenu, setIsOpenBuildingMenu] = useState<boolean>(false);
  const [placingBuilding, setPlacingBuilding] = useState<Building | null>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const buildingMenuRef = useRef<HTMLDivElement>(null);
  const shopButtonRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isOpenShop && shopRef.current && !shopRef.current.contains(target) && shopButtonRef.current && !shopButtonRef.current.contains(target)) setIsOpenShop(false);
      if (isOpenBuildingMenu && buildingMenuRef.current && !buildingMenuRef.current.contains(target)) setIsOpenBuildingMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenShop, isOpenBuildingMenu]);

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

  const handleShopClick = (): void => {
    if (isOpenBuildingMenu) return;
    setIsOpenShop((prev) => !prev);
  };
  const handleBuildingMenuClick = (): void => {
    if (isOpenShop) return;
    setIsOpenBuildingMenu((prev) => !prev);
  };
  return (
    <div className="page">
      <div className="page__townhall-level">
        <TownHallLevel currentLevel={6} />
      </div>
      {isOpenShop && (
        <div className="page__shop" ref={shopRef}>
          <Shop
            isOpen={isOpenShop}
            buildings={buildings}
            setIsOpen={handleShopClick}
            onBuildingBuy={(building) => {
              setPlacingBuilding(building);
              setIsOpenShop(false);
            }}
          />
        </div>
      )}
      {isOpenBuildingMenu && (
        <div className="page__building-menu" ref={buildingMenuRef}>
          <BuildingMenu isOpen={isOpenBuildingMenu} building={buildings[0]} setIsOpen={handleBuildingMenuClick} />
        </div>
      )}
      <ul className="page__resources-area">
        <li>
          <Resource maxWidth="300px" imgSrc="images/content/sheep.png" color="#9B7260" currentAmount={gameState.sheep} />
        </li>
        <li>
          <Resource maxWidth="250px" imgSrc="images/content/mong.png" color="#4795A7" currentAmount={gameState.population} />
        </li>
        <li>
          <Resource maxWidth="200px" imgSrc="images/content/grass.png" color="#455A4B" currentAmount={20} />
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
              <Button onClick={() => setIsOpenShop((prev) => !prev)} variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">
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
          onBuildingClick={() => {
            if (placingBuilding === null) handleBuildingMenuClick();
          }}
        />
      )}
    </div>
  );
};
export default App;
