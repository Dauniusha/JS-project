import { BaseComponents } from "../models/base-component";
import { ClearMove } from "../models/clear-move";
import { Move } from "../move/move";
import { setting } from "../settings/setting";
import './move-table.css';

export class MoveTable extends BaseComponents {
  private fullPieceName: Move[] = [];

  constructor() {
    super('div', [setting.classNames.game.playerMoveTable]);
  }

  addMove(pieceName: string, color: string, startcell: string, endCell: string /* time: string */) {
    const fullPieceName = color  + pieceName;
    const move = new Move(fullPieceName, startcell, endCell);
    this.fullPieceName.push(move);
    this.element.appendChild(move.element);
  }

  DBinit() {
    ///
  }

  takeMove(i: number): Move {
    return this.fullPieceName[i];
  }

  getAllMoves(): ClearMove[] {
    const clearMoves: ClearMove[] = [];
    this.fullPieceName.forEach((move) => {
      clearMoves.push(move.getClearMove());
    });
    return clearMoves;
  }
 }