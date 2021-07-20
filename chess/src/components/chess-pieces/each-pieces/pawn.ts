import { cellCoordinatesToName } from "../../../shared/cell-coordinates-to-cell-name";
import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { color } from "../../models/game/color-interface";
import { Coordinates } from "../../models/game/coordinates-interface";
import { Setup } from "../../models/setup-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Pawn extends BasePiece {
  private readonly pawnIncrement: number;

  private startRow: string;
  
  canBeCapturedEnPassant: boolean = false;

  constructor(position: string, pieceColor: string) {
    super(position, pieceColor, 'Pawn');
    const pieceType = pieceColor + this.name;
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];

    if (setting.isWhiteFromBelow) {
      [ this.pawnIncrement, this.startRow ] = this.color === color.white ? [ 1, '2' ] : [ -1, '7' ];
    } else {
      [ this.pawnIncrement, this.startRow ] = this.color === color.white ? [ -1, '7' ] : [ 1, '2' ];
    }
  }

  possibleMoveDetermination(gameSetup: Setup[]) {
    this.possibleMoves = [];
    const cellCoordinates = cellNameToCoordinates(this.cell);

    const canMove = this.possiblePawnMoveCheck(cellCoordinates, gameSetup);

    if (canMove && this.cell[1] === this.startRow) {
      this.possiblePawnMoveCheck({ X: cellCoordinates.X, Y: cellCoordinates.Y + this.pawnIncrement }, gameSetup);
    }

    this.possibleCaptureCheck(cellCoordinates, -1, gameSetup);
    this.possibleCaptureCheck(cellCoordinates, 1, gameSetup);
  }

  possiblePawnMoveCheck(pieceCoordinates: Coordinates, gameSetup: Setup[]): boolean {
    const newPosition = pieceCoordinates.Y + this.pawnIncrement;
    if (newPosition < 8 && newPosition > -1 && !BasePiece.piecesCheck({ X: pieceCoordinates.X, Y: newPosition }, gameSetup)) {
      this.possibleMoves.push(cellCoordinatesToName({ X: pieceCoordinates.X, Y: newPosition }));
      return true;
    } else {
      return false;
    }
  }

  possibleCaptureCheck(pieceCoordinates: Coordinates, incrementX: number, gameSetup: Setup[]) {
    const newCoordinateX = pieceCoordinates.X + incrementX;
    const newCoordinateY = pieceCoordinates.Y + this.pawnIncrement;
    if (
      newCoordinateX < 8 && newCoordinateX > -1
      && newCoordinateY < 8 && newCoordinateY > -1
      && BasePiece.piecesCheck({ X: newCoordinateX, Y: newCoordinateY }, gameSetup)
      && BasePiece.piecesCheck({ X: newCoordinateX, Y: newCoordinateY }, gameSetup) !== this.color
      ) {
        this.possibleMoves.push(cellCoordinatesToName({ X: newCoordinateX, Y: newCoordinateY }));
    }
  }

  getPawnIncrement(): number {
    return this.pawnIncrement;
  }
}