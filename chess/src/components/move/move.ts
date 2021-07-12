import { createElement } from "../../shared/create-element";
import { BaseComponents } from "../models/base-component";
import { setting } from "../settings/setting";
import './move.css';

export class Move extends BaseComponents {

  constructor(private fullName: string, private startCell: string, private endCell: string, private time: string = '1:30') {
    super('div', [setting.classNames.game.playerMoveTableEach]);

    const pieceImg = createElement([setting.classNames.game.playerMoveTableImg]);
    pieceImg.style.backgroundImage = `url(${setting.imgNames[<keyof typeof setting.imgNames> this.fullName]})`;
    
    const pieceCells = createElement([setting.classNames.game.playerMoveTableCells]);
    pieceCells.innerHTML = `${this.startCell} - ${this.endCell}`;

    const timeElement = createElement([setting.classNames.game.playerMoveTableTime]);
    timeElement.innerHTML = this.time; // TODO: Возможно врем янадо будет передавать не готовой строкой

    this.element.appendChild(pieceImg);
    this.element.appendChild(pieceCells);
    this.element.appendChild(timeElement);
  }
}