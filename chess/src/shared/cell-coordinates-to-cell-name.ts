import { Coordinates } from "../components/models/game/coordinates-interface";

export function cellCoordinatesToName(coordinates: Coordinates): string {
  const nameChar = String.fromCharCode(coordinates.X + 97);
  const nameNumber = String(coordinates.Y + 1);
  return nameChar + nameNumber;
}