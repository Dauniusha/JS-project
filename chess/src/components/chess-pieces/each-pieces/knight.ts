import { cellCoordinatesToName } from "../../../shared/cell-coordinates-to-cell-name";
import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { Coordinates } from "../../models/coordinates-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Knight extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color);
    const pieceType = color + 'Knight';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
    this.possibleMoveDetermination();
  }

  possibleMoveDetermination() {
    const cellCoordinates = cellNameToCoordinates(this.cell);

    this.possibleMoveCheck(cellCoordinates, 1, 2);
    this.possibleMoveCheck(cellCoordinates, -1, 2);

    this.possibleMoveCheck(cellCoordinates, 1, -2);
    this.possibleMoveCheck(cellCoordinates, -1, -2);
    
    this.possibleMoveCheck(cellCoordinates, 2, 1);
    this.possibleMoveCheck(cellCoordinates, 2, -1);

    this.possibleMoveCheck(cellCoordinates, -2, 1);
    this.possibleMoveCheck(cellCoordinates, -2, -1);
  }

  possibleMoveCheck(pieceCoordinates: Coordinates, incrementX: number, incrementY: number) {
    const newX = pieceCoordinates.X + incrementX;
    const newY = pieceCoordinates.Y + incrementY;
    if ((newX < 8 && newX > -1 && newY < 8 && newY > -1) && BasePiece.piecesCheck({ X: newX, Y: newY }) !== this.color) {
      this.possibleMoves.push(cellCoordinatesToName({ X: newX, Y: newY }));
    }
  }
}