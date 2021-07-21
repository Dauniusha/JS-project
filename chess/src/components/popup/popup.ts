import { createElement } from "../../shared/create-element";
import { BaseComponents } from "../models/base-component";
import { setting } from "../settings/setting";
import './popup.css';

export class Popup extends BaseComponents {
  readonly popUp: BaseComponents;

  readonly text: HTMLParagraphElement;

  constructor(isConfirm: boolean = false) {
    super('div', ['popup', setting.classNames.popups.closeClass]);
    const popUpInner = new BaseComponents('div', ['popup__inner']);
    this.popUp = new BaseComponents('div', ['popup__container']);
    popUpInner.element.appendChild(this.popUp.element);
    this.text = this.popupTextInit();
    if (!isConfirm) {
      this.btnsInit();
    } else {
      popUpInner.element.id = 'confirm-popup';
    }
    this.element.appendChild(popUpInner.element);
  }

  showPopup() {
    this.element.classList.remove(setting.classNames.popups.closeClass);
  }

  closePopup(): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.add(setting.classNames.popups.closeClass);
      this.element.addEventListener('transitionend', () => resolve());
    });
  }

  private btnsInit() {
    const toLobbyBtn = document.createElement('a');
    toLobbyBtn.innerHTML = 'To lobby';
    toLobbyBtn.href = '#/Lobby';
    toLobbyBtn.classList.add(setting.classNames.popups.popupLobbyBtn);
    this.popUp.element.appendChild(toLobbyBtn);

    const watchReplaysBtn = document.createElement('a');
    watchReplaysBtn.innerHTML = 'Watch replay';
    watchReplaysBtn.href = '#/Replays';
    watchReplaysBtn.classList.add(setting.classNames.popups.popupReplaysBtn);
    this.popUp.element.appendChild(watchReplaysBtn);
  }

  private popupTextInit(): HTMLParagraphElement {
    const text = document.createElement('p');
    text.classList.add(setting.classNames.popups.popupText);
    this.popUp.element.appendChild(text);
    return text;
  }

  confirmPopupBtns(): HTMLElement[] {
    const confirmBtn = createElement([setting.classNames.popups.popupLobbyBtn]);
    confirmBtn.id = 'confirm';
    confirmBtn.innerHTML = 'Confirm';
    this.popUp.element.appendChild(confirmBtn);

    const refuseBtn = createElement([setting.classNames.popups.popupReplaysBtn]);
    refuseBtn.id = 'refuse';
    refuseBtn.innerHTML = 'Refuse';
    this.popUp.element.appendChild(refuseBtn);

    return [ confirmBtn, refuseBtn ];
  }
}