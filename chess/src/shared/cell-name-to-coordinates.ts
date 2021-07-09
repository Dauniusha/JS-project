import { Coordinates } from "../components/models/game/coordinates-interface";

export function cellNameToCoordinates(name: string): Coordinates {
  const nameCharCode = name.charCodeAt(0);
  const nameNumber = Number(name[1]);
  return { X: nameCharCode - 97, Y: nameNumber - 1 };
}