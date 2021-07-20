import { cellCoordinatesToName } from "../../shared/cell-coordinates-to-cell-name";
import { BaseComponents } from "../models/base-component";
import { color } from "../models/game/color-interface";
import { Coordinates } from "../models/game/coordinates-interface";
import { Setup } from "../models/setup-interface";
import { setting } from "../settings/setting";

export class BasePiece extends BaseComponents {
  cell: string;

  readonly color: string;

  possibleMoves: string[] = [];

  constructor(position: string, color: string, readonly name: string) {
    super('img', [setting.classNames.piece]);
    this.cell = position;
    this.color = color;
  }

  static piecesCheck(coordinates: Coordinates, gameSetup: Setup[]): string | void {
    const name = cellCoordinatesToName({ X: coordinates.X, Y: coordinates.Y });
    let piece: string = ''; // Clear
    gameSetup.forEach((setup) => {
      if (setup.cell === name) {
        piece = setup.piece;
        return;
      }
    });
    if(piece) {
      if (piece.indexOf(color.black) !== -1) {
        return color.black;
      } else {
        return color.white;
      }
    }
  }

  possibleMoveCheck(pieceCoordinates: Coordinates, incrementX: number, incrementY: number, gameSetup: Setup[]) {
    for (
        let i = pieceCoordinates.X + incrementX, j = pieceCoordinates.Y + incrementY;
        i < 8 && i > -1 && j < 8 && j > -1;
        i += incrementX, j += incrementY
        ) {
          let incrementCoordinates = { X: i, Y: j };
          const color = BasePiece.piecesCheck(incrementCoordinates, gameSetup);
          if (color) {
            if (color !== this.color) {
              this.possibleMoves.push(cellCoordinatesToName(incrementCoordinates));
            }
            break;
          }
         this. possibleMoves.push(cellCoordinatesToName(incrementCoordinates));
        }
  }
}