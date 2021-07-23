import { cellCoordinatesToName } from '../../../shared/cell-coordinates-to-cell-name';
import { cellNameToCoordinates } from '../../../shared/cell-name-to-coordinates';
import { Setup } from '../../models/setup-interface';
import { setting } from '../../settings/setting';
import { BasePiece } from '../base-piece';

export class King extends BasePiece {
  isFirstMove = true;

  constructor(position: string, color: string) {
    super(position, color, 'King');
    const pieceType = color + this.name;
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
  }

  possibleMoveDetermination(gameSetup: Setup[]) {
    this.possibleMoves = [];
    const cellCoordinates = cellNameToCoordinates(this.cell);

    for (let i = cellCoordinates.Y - 1; i < cellCoordinates.Y + 2; i++) {
      if (i < 8 && i > -1) {
        for (let j = cellCoordinates.X - 1; j < cellCoordinates.X + 2; j++) {
          if (j < 8 && j > -1 && BasePiece.piecesCheck({ X: j, Y: i }, gameSetup) !== this.color) {
            this.possibleMoves.push(cellCoordinatesToName({ X: j, Y: i }));
          }
        }
      }
    }
  }
}
