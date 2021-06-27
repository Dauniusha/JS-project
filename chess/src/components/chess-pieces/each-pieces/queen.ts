import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Queen extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color);
    const pieceType = color + 'Queen';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
    this.possibleMoveDetermination();
  }

  possibleMoveDetermination() {
    const cellCoordinates = cellNameToCoordinates(this.cell);
    
    this.possibleMoveCheck(cellCoordinates, -1, 1);
    this.possibleMoveCheck(cellCoordinates, 0, 1);
    this.possibleMoveCheck(cellCoordinates, 1, 1);
    this.possibleMoveCheck(cellCoordinates, 1, 0);

    this.possibleMoveCheck(cellCoordinates, 1, -1);
    this.possibleMoveCheck(cellCoordinates, 0, -1);
    this.possibleMoveCheck(cellCoordinates, -1, -1);
    this.possibleMoveCheck(cellCoordinates, -1, 0);
  }
}