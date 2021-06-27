import { cellCoordinatesToName } from "../../../shared/cell-coordinates-to-cell-name";
import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { Coordinates } from "../../models/coordinates-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Bishop extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color);
    const pieceType = color + 'Bishop';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
  }

  possibleMoveDetermination() {
    this.possibleMoves = [];
    const cellCoordinates = cellNameToCoordinates(this.cell);
    
    this.possibleMoveCheck(cellCoordinates, -1, 1);
    this.possibleMoveCheck(cellCoordinates, 1, 1);
    this.possibleMoveCheck(cellCoordinates, 1, -1);
    this.possibleMoveCheck(cellCoordinates, -1, -1);
  }
}