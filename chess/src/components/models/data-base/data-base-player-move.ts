import { Move } from "../../move/move";
import { ClearMove } from "../clear-move";
import { PlayerDBObject } from "./data-base-player-object";

export interface PlayerWithMove {
  player: PlayerDBObject;
  moves: ClearMove[]; 
}