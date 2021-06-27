import { cellCoordinatesToName } from "../../../shared/cell-coordinates-to-cell-name";
import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { color } from "../../models/color-interface";
import { Coordinates } from "../../models/coordinates-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Pawn extends BasePiece {
  private readonly pawnIncrement: number;

  private startRow: string;
  
  // canBeCapturedEnPassant: boolean = false;

  constructor(position: string, pieceColor: string) {
    super(position, pieceColor);
    const pieceType = pieceColor + 'Pawn';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];

    if (setting.isWhiteFromBelow) {
      [ this.pawnIncrement, this.startRow ] = this.color === color.white ? [ 1, '2' ] : [ -1, '7' ];
    } else {
      [ this.pawnIncrement, this.startRow ] = this.color === color.white ? [ -1, '7' ] : [ 1, '2' ];
    }

    this.possibleMoveDetermination();

    console.log(this.possibleMoves);
  }

  possibleMoveDetermination() {
    const cellCoordinates = cellNameToCoordinates(this.cell);

    const canMove = this.possibleMoveCheck(cellCoordinates);

    if (canMove && this.cell[1] === this.startRow) {
      this.possibleMoveCheck({ X: cellCoordinates.X, Y: cellCoordinates.Y + this.pawnIncrement });
    }

    this.possibleCaptureCheck(cellCoordinates, -1);
    this.possibleCaptureCheck(cellCoordinates, 1);
  }

  possibleMoveCheck(pieceCoordinates: Coordinates): boolean {
    const newPosition = pieceCoordinates.Y + this.pawnIncrement;
    if (newPosition < 8 && newPosition > -1 && !BasePiece.piecesCheck({ X: pieceCoordinates.X, Y: newPosition })) {
      this.possibleMoves.push(cellCoordinatesToName({ X: pieceCoordinates.X, Y: newPosition }));
      return true;
    } else {
      return false;
    }
  }

  possibleCaptureCheck(pieceCoordinates: Coordinates, incrementX: number) {
    const newCoordinateX = pieceCoordinates.X + incrementX;
    const newCoordinateY = pieceCoordinates.Y + this.pawnIncrement;
    if (
      newCoordinateX < 8 && newCoordinateX > -1
      && newCoordinateY < 8 && newCoordinateY > -1
      && BasePiece.piecesCheck({ X: newCoordinateX, Y: newCoordinateY })
      && BasePiece.piecesCheck({ X: newCoordinateX, Y: newCoordinateY }) !== this.color
      ) {
        this.possibleMoves.push(cellCoordinatesToName({ X: newCoordinateX, Y: newCoordinateY }));
    }
    // ... capturing realization
  }
}