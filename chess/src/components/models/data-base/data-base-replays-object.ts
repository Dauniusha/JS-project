import { PlayerWithMove } from "./data-base-player-move";
import { PlayerDBObject } from "./data-base-player-object";

export interface ReplaysDBObject {
  firstPlayer: PlayerWithMove;

  secondPlayer: PlayerWithMove;

  winner: PlayerDBObject;

  time: string;
}