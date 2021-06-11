import { BaseComponents } from '../models/base-component';
import { setting } from '../setting';
import './popup.css';

export class Popup extends BaseComponents {
  popUp: BaseComponents;

  constructor() {
    super('div', ['popup', setting.offClasses.popupCloseClass]);
    const popUpInner = new BaseComponents('div', ['popup__inner']);
    this.popUp = new BaseComponents('div', ['popup__container']);
    popUpInner.element.appendChild(this.popUp.element);
    this.element.appendChild(popUpInner.element);
  }

  showPopup() {
    this.element.classList.remove(setting.offClasses.popupCloseClass);
  }

  closePopup(): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.add(setting.offClasses.popupCloseClass);
      this.element.addEventListener('transitionend', () => resolve());
    });
  }
}
