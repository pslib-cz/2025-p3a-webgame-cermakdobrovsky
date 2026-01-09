import { useState, useEffect } from "react";
import type { Map } from "./../types/mapModels";
import MapCanvas from "./map/MapCanvas";

const App = () => {
  const [maps, setMaps] = useState<Map[]>([]);

  useEffect(() => {
    fetch("/api/test/maps")
      .then((response) => response.json())
      .then((data) => setMaps(data));
  }, []);

  return <>{maps.length > 0 && <MapCanvas map={maps[0]} tileSize={64} />}</>;
};

export default App;
