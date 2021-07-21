import { createElement } from '../../shared/create-element';
import { BaseComponents } from '../models/base-component';
import { setting } from '../settings/setting';
import './header.css';

export class Header extends BaseComponents {
  private readonly container: HTMLElement;

  private nextMoveBtn?: HTMLElement;

  private previousMoveBtn?: HTMLElement;

  private surrenderBtn?: HTMLElement;

  private drawBtn?: HTMLElement;

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
      <a href="#/Lobby" class="${setting.classNames.headers.logoText}">Chess</a>
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

  createSurrenderAndDrawBtns(): { surrenderBtn: HTMLElement, drawBtn: HTMLElement } {
    const btnsContainer = createElement([ setting.classNames.headers.gameBtnsContainer ]);

    this.surrenderBtn = createElement([ setting.classNames.headers.gameBtn ]);
    this.surrenderBtn.innerHTML = 'surrender';
    this.surrenderBtn.id = 'surrender';
    btnsContainer.appendChild(this.surrenderBtn);

    this.drawBtn = createElement([ setting.classNames.headers.gameBtn ]);
    this.drawBtn.innerHTML = 'offer a draw';
    this.drawBtn.id = 'draw';
    btnsContainer.appendChild(this.drawBtn);

    this.container.appendChild(btnsContainer);

    return { surrenderBtn: this.surrenderBtn, drawBtn: this.drawBtn };
  }

  removeAllBtns() {
    this.nextMoveBtn?.parentElement?.remove();
    this.nextMoveBtn = undefined;
    this.previousMoveBtn = undefined;

    this.surrenderBtn?.parentElement?.remove();
    this.surrenderBtn = undefined;
    this.drawBtn = undefined;
  }

  /* getReplayBtns(): { previousBtn: HTMLElement, nextBtn: HTMLElement } {
    if (this.previousMoveBtn && this.nextMoveBtn) {
      return { previousBtn: this.previousMoveBtn, nextBtn: this.nextMoveBtn }; 
    } else {
      throw new Error('Btns does not exist!');
    }
  } */
}