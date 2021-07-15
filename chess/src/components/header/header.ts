import { createElement } from '../../shared/create-element';
import { BaseComponents } from '../models/base-component';
import { setting } from '../settings/setting';
import './header.css';

export class Header extends BaseComponents {
  private readonly container: HTMLElement;

  private nextMoveBtn?: HTMLElement;

  private previousMoveBtn?: HTMLElement;

  constructor() {
    super('header', [setting.classNames.headers.header]);
    
    this.container = document.createElement('div');
    this.container.classList.add(setting.classNames.headers.container);

    this.element.appendChild(this.container);

    this.addLogo();
  }

  private addLogo() {
    const logoElement = document.createElement('div');
    logoElement.classList.add(setting.classNames.headers.logo);
    logoElement.innerHTML = `
      <img class="${setting.classNames.headers.logoImg}" src="../../../logo/logo.svg">
      <span class="${setting.classNames.headers.logoText}">Chess</span>
    `;
    this.container.appendChild(logoElement);
  }

  createReplayBtns(): { previousBtn: HTMLElement, nextBtn: HTMLElement } {
    const replayBtns = createElement([ setting.classNames.replays.headerBtns ]);

    this.previousMoveBtn = createElement([ setting.classNames.replays.headerBtn ]);
    this.previousMoveBtn.style.backgroundImage = `url(${setting.imgNames.leftArrow})`;
    replayBtns.appendChild(this.previousMoveBtn);

    this.nextMoveBtn = createElement([ setting.classNames.replays.headerBtn ]);
    this.nextMoveBtn.style.backgroundImage = `url(${setting.imgNames.rightArrow})`;
    replayBtns.appendChild(this.nextMoveBtn);

    this.container.appendChild(replayBtns);

    return { previousBtn: this.previousMoveBtn, nextBtn: this.nextMoveBtn };
  }

  /* getReplayBtns(): { previousBtn: HTMLElement, nextBtn: HTMLElement } {
    if (this.previousMoveBtn && this.nextMoveBtn) {
      return { previousBtn: this.previousMoveBtn, nextBtn: this.nextMoveBtn }; 
    } else {
      throw new Error('Btns does not exist!');
    }
  } */
}