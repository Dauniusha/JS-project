import { setting } from "../../settings/setting";
import { BasePiece } from "../base-piece";

export class King extends BasePiece {
  constructor(position: string, color: string) {
    super(position, color);
    const pieceType = color + 'King';
    this.element.setAttribute(setting.classNames.dataPiece, pieceType);
    (<HTMLImageElement> this.element).src = setting.imgNames[<keyof typeof setting.imgNames> pieceType];
  }
}