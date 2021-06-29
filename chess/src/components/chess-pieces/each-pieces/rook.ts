import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { Setup } from "../../models/setup-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Rook extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color);
    const pieceType = color + 'Rook';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
  }

  possibleMoveDetermination(gameSetup: Setup[]) {
    this.possibleMoves = [];
    const cellCoordinates = cellNameToCoordinates(this.cell);

    this.possibleMoveCheck(cellCoordinates, 0, 1, gameSetup);
    this.possibleMoveCheck(cellCoordinates, 0, -1, gameSetup);
    this.possibleMoveCheck(cellCoordinates, 1, 0, gameSetup);
    this.possibleMoveCheck(cellCoordinates, -1, 0, gameSetup);
  }

  getPossibleMoves(): string[] {
    return this.possibleMoves;
  }
}