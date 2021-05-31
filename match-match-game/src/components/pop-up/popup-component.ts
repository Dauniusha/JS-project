import './popup-component.css';
import { BaseComponents } from '../base-conponents';

const CLOSE_CLASS = 'popup_close';

export class Popup extends BaseComponents {
  popUp: BaseComponents;

  constructor() {
    super('div', ['popup', `${CLOSE_CLASS}`]);
    const popUpInner = new BaseComponents('div', ['popup__inner']);
    this.popUp = new BaseComponents('div', ['popup__container']);
    popUpInner.element.appendChild(this.popUp.element);
    this.element.appendChild(popUpInner.element);
  }

  showPopup() {
    this.element.classList.remove(CLOSE_CLASS);
  }

  closePopup() {
    this.element.classList.add(CLOSE_CLASS);
  }
}
