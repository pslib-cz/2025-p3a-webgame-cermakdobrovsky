import { use } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./styles/global.css";
import { Button, Resource, TownHallLevel, Shop } from "./components";

const mapsPromise: Promise<Map[]> = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const maps: Map[] = use<Map[]>(mapsPromise);

  return (
    <div className="page">
      <div className="page__townhall-level">
        <TownHallLevel currentLevel={6}/>
      </div>
      <div>
        <Shop/>
      </div>
      <ul className="page__resources-area">
        <li><Resource maxAmount={1700} currentAmount={1230} maxWidth="300px" imgSrc="images/content/sheep.png" color="#9B7260"/></li>
        <li><Resource maxAmount={350} currentAmount={211} maxWidth="250px" imgSrc="images/content/mong.png" color="#4795A7"/></li>
        <li><Resource maxAmount={30} currentAmount={20} maxWidth="200px" imgSrc="images/content/grass.png" color="#455A4B"/></li>
      </ul>
      <ul className="page__buttons-area">
        <li><Button variant="secondary" imgSrc="images/content/warrior.png">Útok</Button></li>
        <li><Button variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">Stavět</Button></li>
      </ul>
      {maps.length > 0 && <MapCanvas groundMap={maps[0]} buildingsMap={maps[1]} tileSize={54}/>}
    </div>
  )
};
export default App;