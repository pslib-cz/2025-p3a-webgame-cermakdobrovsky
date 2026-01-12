import { use } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./styles/global.css";
import { Button } from "./components";

const mapsPromise: Promise<Map[]> = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const maps: Map[] = use<Map[]>(mapsPromise);

  return (
    <div className="page">
      <div className="page__button-area">
        <Button variant="secondary" imgSrc="images/content/warrior.png">Útok</Button>
        <Button variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">Stavět</Button>
      </div>
      {maps.length > 0 && <MapCanvas groundMap={maps[0]} buildingsMap={maps[1]} tileSize={54}/>}
    </div>
  )
};
export default App;