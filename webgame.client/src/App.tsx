import { use, useState } from "react";
import type { Map } from "./../types/mapModels";

const mapsPromise = fetch("/api/test/maps").then(res => res.json());
const App = () => {
  //Hooks
  const initialMaps = use<Map[]>(mapsPromise);
  const [maps, setMaps] = useState<Map[]>(initialMaps);

  return (
    <div>
      <h1>Maps</h1>
      <h2>{JSON.stringify(maps)}</h2>
    </div>
  );
};
export default App;