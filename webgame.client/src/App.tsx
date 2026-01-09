import { use, useState } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";
import "./global.css";

const mapsPromise = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const initialMaps = use<Map[]>(mapsPromise);
  const [maps, setMaps] = useState<Map[]>(initialMaps);

  return (
    <>
      {maps.length > 0 && <MapCanvas map={maps[0]} tileSize={64} />}
    </>
  )
};
export default App;