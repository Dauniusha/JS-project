import { cellCoordinatesToName } from "../../shared/cell-coordinates-to-cell-name";
import { BaseComponents } from "../models/base-component";
import { color } from "../models/color-interface";
import { Coordinates } from "../models/coordinates-interface";
import { setting } from "../settings/setting";

export class BasePiece extends BaseComponents {
  cell: string;

  readonly color: string;

  possibleMoves: string[] = [];

  constructor(position: string, color: string) {
    super('img', [setting.classNames.piece]);
    this.cell = position;
    this.color = color;
  }

  static piecesCheck(coordinates: Coordinates): string | void {
    const name = cellCoordinatesToName({ X: coordinates.X, Y: coordinates.Y });
    let piece: string = ''; // Clear
    setting.gameSetup.forEach((setup) => {
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

  possibleMoveCheck(pieceCoordinates: Coordinates, incrementX: number, incrementY: number) {
    for (
        let i = pieceCoordinates.X + incrementX, j = pieceCoordinates.Y + incrementY;
        i < 8 && i > -1 && j < 8 && j > -1;
        i += incrementX, j += incrementY
        ) {
          let incrementCoordinates = { X: i, Y: j };
          const color = BasePiece.piecesCheck(incrementCoordinates);
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