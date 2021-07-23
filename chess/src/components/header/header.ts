import { createElement } from '../../shared/create-element';
import { BaseComponents } from '../models/base-component';
import { ReplayBtns } from '../models/replays/replays-btns';
import { setting } from '../settings/setting';
import { timer } from '../timer/timer';
import './header.css';

export class Header extends BaseComponents {
  private readonly container: HTMLElement;

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

  createReplayBtns(): ReplayBtns {
    const moveBtns = this.createReplayMoveBtns();
    const boostMoveBtns = this.createReplayBoostModeBtns();
    this.createExitBtn();

    return {
      moveBtns: moveBtns,
      boostBtns: boostMoveBtns,
    };
  }

  private createReplayMoveBtns(): { prevBtn: HTMLElement, stopBtn: HTMLElement, nextBtn: HTMLElement } {
    const container = createElement([ setting.classNames.headers.replaysMoveBtns ]);

    const previousMoveBtn = createElement([ setting.classNames.headers.replaysMoveBtn, setting.classNames.disable ]);
    previousMoveBtn.style.backgroundImage = `url(${setting.imgNames.leftArrow})`;
    container.appendChild(previousMoveBtn);

    const stopMoveBtn = createElement([ setting.classNames.headers.replaysMoveBtn ]);
    stopMoveBtn.style.backgroundImage = `url(${setting.imgNames.pause})`;
    container.appendChild(stopMoveBtn);

    const nextMoveBtn = createElement([ setting.classNames.headers.replaysMoveBtn ]);
    nextMoveBtn.style.backgroundImage = `url(${setting.imgNames.rightArrow})`;
    container.appendChild(nextMoveBtn);

    this.container.appendChild(container);

    return { prevBtn: previousMoveBtn, stopBtn: stopMoveBtn, nextBtn: nextMoveBtn };
  }

  private createReplayBoostModeBtns(): HTMLElement[] {
    const container = createElement([ setting.classNames.headers.replaysBoostBtns ])

    const boostModeBtns: HTMLElement[] = [];

    for (let i = 0; i < setting.boostBtnsAmount; i++) {
      const btn = createElement([ setting.classNames.headers.replaysBoostBtn ]);
      btn.id = String(i + 1);
      btn.innerHTML = `x${i + 1}`;

      container.appendChild(btn);
      boostModeBtns.push(btn);
    }

    this.container.appendChild(container);

    return boostModeBtns;
  }

  private createExitBtn() {
    const exitBtn = document.createElement('a');
    exitBtn.classList.add(setting.classNames.headers.replaysExitBtn);
    exitBtn.href = '#/Replays';
    exitBtn.style.backgroundImage = `url(${setting.imgNames.exit})`

    this.container.appendChild(exitBtn);

    return exitBtn;
  }

  createSurrenderAndDrawBtns(): { surrenderBtn: HTMLElement, drawBtn: HTMLElement } {
    const btnsContainer = createElement([setting.classNames.headers.gameBtnsContainer]);

    this.surrenderBtn = createElement([setting.classNames.headers.gameBtn]);
    this.surrenderBtn.innerHTML = 'surrender';
    this.surrenderBtn.id = 'surrender';
    btnsContainer.appendChild(this.surrenderBtn);

    this.drawBtn = createElement([setting.classNames.headers.gameBtn]);
    this.drawBtn.innerHTML = 'offer a draw';
    this.drawBtn.id = 'draw';
    btnsContainer.appendChild(this.drawBtn);

    this.container.appendChild(btnsContainer);

    return { surrenderBtn: this.surrenderBtn, drawBtn: this.drawBtn };
  }

  removeAllBtns() {
    this.container.innerHTML = '';
    this.addLogo();
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  /* getReplayBtns(): { previousBtn: HTMLElement, nextBtn: HTMLElement } {
    if (this.previousMoveBtn && this.nextMoveBtn) {
      return { previousBtn: this.previousMoveBtn, nextBtn: this.nextMoveBtn };
    } else {
      throw new Error('Btns does not exist!');
    }
  } */
}
