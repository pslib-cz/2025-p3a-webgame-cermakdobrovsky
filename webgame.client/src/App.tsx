import { use } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./styles/global.css";
import { Button } from "./components";

const mapsPromise: Promise<Map[]> = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const initialMaps: Map[] = use<Map[]>(mapsPromise);

  return (
    <div className="page">
      <div className="page__button-area">
        <Button variant="secondary" imgSrc="images/content/warrior.png">Útok</Button>
        <Button variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">Stavět</Button>
      </div>
      {initialMaps.length > 0 && <MapCanvas map={initialMaps[0]} tileSize={64}/>}
    </div>
  )
};
export default App;