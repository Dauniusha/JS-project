import { cellCoordinatesToName } from "../../../shared/cell-coordinates-to-cell-name";
import { cellNameToCoordinates } from "../../../shared/cell-name-to-coordinates";
import { Coordinates } from "../../models/game/coordinates-interface";
import { Setup } from "../../models/setup-interface";
import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class Knight extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color, 'Knight');
    const pieceType = color + this.name;
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
  }

  possibleMoveDetermination(gameSetup: Setup[]) {
    this.possibleMoves = [];
    const cellCoordinates = cellNameToCoordinates(this.cell);

    this.possibleMoveCheck(cellCoordinates, 1, 2, gameSetup);
    this.possibleMoveCheck(cellCoordinates, -1, 2, gameSetup);

    this.possibleMoveCheck(cellCoordinates, 1, -2, gameSetup);
    this.possibleMoveCheck(cellCoordinates, -1, -2, gameSetup);
    
    this.possibleMoveCheck(cellCoordinates, 2, 1, gameSetup);
    this.possibleMoveCheck(cellCoordinates, 2, -1, gameSetup);

    this.possibleMoveCheck(cellCoordinates, -2, 1, gameSetup);
    this.possibleMoveCheck(cellCoordinates, -2, -1, gameSetup);
  }

  possibleMoveCheck(pieceCoordinates: Coordinates, incrementX: number, incrementY: number, gameSetup: Setup[]) {
    const newX = pieceCoordinates.X + incrementX;
    const newY = pieceCoordinates.Y + incrementY;
    if ((newX < 8 && newX > -1 && newY < 8 && newY > -1) && BasePiece.piecesCheck({ X: newX, Y: newY }, gameSetup) !== this.color) {
      this.possibleMoves.push(cellCoordinatesToName({ X: newX, Y: newY }));
    }
  }
}