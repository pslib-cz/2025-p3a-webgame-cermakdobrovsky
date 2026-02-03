import type { GameState } from "../types/gameModels";

//Promises
export const playerIdPromise: Promise<string> = (async () => {
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

export const gameStatePromise: Promise<GameState> = playerIdPromise.then(async (playerId) => {
  let res = await fetch(`/api/game/state/${playerId}`);
  if (!res.ok) {
    await fetch(`/api/game/create/?playerId=${playerId}`);
    res = await fetch(`/api/game/state/${playerId}`);
  }
  const data = await res.json();
  return data;
});