import { use, useState } from "react";
import type { GameState } from "./../types/gameModels";
import type { Building, Map } from "./../types/mapModels";
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
  const gameState: GameState = use<GameState>(gameStatePromise);
  const buildings: Building[] = use<Building[]>(buildingsPromise);
  const [isOpenShop, setIsOpenShop] = useState<boolean>(false);
  const [isOpenBuildingMenu, setIsOpenBuildingMenu] = useState<boolean>(false);

  const handleShopClick = (): void => {
    if (isOpenBuildingMenu) return;
    setIsOpenShop((prev) => !prev);
  }
  const handleBuildingMenuClick = (): void => {
    if (isOpenShop) return;
    setIsOpenBuildingMenu((prev) => !prev);
  }
  return (
    <div className="page">
      <div className="page__townhall-level">
        <TownHallLevel currentLevel={6} />
      </div>
      {isOpenShop && (
        <div className="page__shop">
          <Shop isOpen={isOpenShop} buildings={buildings} setIsOpen={handleShopClick} />
        </div>
      )}
      {isOpenBuildingMenu && (
        <div className="page__building-menu">
          <BuildingMenu isOpen={isOpenBuildingMenu} building={buildings[0]} setIsOpen={handleBuildingMenuClick}/>
        </div>
      )}
      <ul className="page__resources-area">
        <li>
          <Resource currentAmount={gameState.sheep} maxWidth="300px" imgSrc="images/content/sheep.png" color="#9B7260" />
        </li>
        <li>
          <Resource currentAmount={gameState.population} maxWidth="250px" imgSrc="images/content/mong.png" color="#4795A7" />
        </li>
        <li>
          <Resource currentAmount={20} maxWidth="200px" imgSrc="images/content/grass.png" color="#455A4B" />
        </li>
      </ul>
      <ul className="page__buttons-area">
        <li>
          <Button variant="secondary" imgSrc="images/content/warrior.png">
            Útok
          </Button>
        </li>
        <li>
          <Button onClick={handleShopClick} variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">
            Stavět
          </Button>
        </li>
      </ul>
      {gameState && <MapCanvas groundMap={groundMap} buildingsMap={gameState.buildingMap} tileSize={54} setIsOpenMenu={handleBuildingMenuClick}/>}
    </div>
  );
};
export default App;