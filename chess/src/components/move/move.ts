import { createElement } from '../../shared/create-element';
import { BaseComponents } from '../models/base-component';
import { ClearMove } from '../models/clear-move';
import { Setup } from '../models/setup-interface';
import { setting } from '../settings/setting';
import './move.css';

export class Move extends BaseComponents {
  constructor(
      private fullName: string,
      private startCell: string,
      private endCell: string,
      private time: string,
      private setup?: Setup[]
    ) {
    super('div', [setting.classNames.game.playerMoveTableEach]);

    const pieceImg = createElement([setting.classNames.game.playerMoveTableImg]);
    pieceImg.style.backgroundImage = `url(${setting.imgNames[<keyof typeof setting.imgNames> this.fullName]})`;

    const pieceCells = createElement([setting.classNames.game.playerMoveTableCells]);
    pieceCells.innerHTML = `${this.startCell} - ${this.endCell}`;

    const timeElement = createElement([setting.classNames.game.playerMoveTableTime]);
    timeElement.innerHTML = this.time;

    this.element.appendChild(pieceImg);
    this.element.appendChild(pieceCells);
    this.element.appendChild(timeElement);
  }

  getClearMove(): ClearMove {
    return {
      fullName: this.fullName,
      startCell: this.startCell,
      endCell: this.endCell,
      time: this.time,
    };
  }

  getSetup(): Setup[] {
    if (this.setup) {
      return this.setup;
    } else {
      throw new Error('Setup does not exist!');
    }
  }

  setSetup(setup: Setup[]) {
    this.setup = setup;
  }
}
