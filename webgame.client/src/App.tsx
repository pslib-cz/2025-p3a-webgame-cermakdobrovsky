import { useState, useEffect } from "react";
import type { Map } from "./../types/mapModels";

const App = () => {
  const [maps, setMaps] = useState<Map[]>([]);

  useEffect(() => {
    fetch("/api/test/maps")
      .then((response) => response.json())
      .then((data) => setMaps(data));
  }, []);

  return (
    <div>
      <h1>Maps</h1>
      <h2>{JSON.stringify(maps)}</h2>
    </div>
  );
};

export default App;
