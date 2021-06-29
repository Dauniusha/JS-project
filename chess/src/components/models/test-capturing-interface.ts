import { Bishop } from "../chess-pieces/each-pieces/bishop";
import { King } from "../chess-pieces/each-pieces/king";
import { Knight } from "../chess-pieces/each-pieces/knight";
import { Pawn } from "../chess-pieces/each-pieces/pawn";
import { Queen } from "../chess-pieces/each-pieces/queen";
import { Rook } from "../chess-pieces/each-pieces/rook";
import { Setup } from "./setup-interface";

export interface TestCapturedPiece {
  capturedPieceSetup: Setup;
  capturedPiece: Queen | King | Knight | Bishop | Pawn | Rook;
}