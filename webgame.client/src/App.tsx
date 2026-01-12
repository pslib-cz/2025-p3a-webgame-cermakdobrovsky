import { use, useState } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./global.css";

const mapsPromise: Promise<Map[]> = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const initialMaps: Map[] = use<Map[]>(mapsPromise);
  const [maps, setMaps] = useState<Map[]>(initialMaps);

  return (
    <>
      {maps.length > 0 && <MapCanvas groundMap={maps[0]} buildingsMap={maps[1]} tileSize={54}/>}
    </>
  )
};
export default App;
