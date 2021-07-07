import { createElement } from '../../shared/create-element';
import { BaseComponents } from '../models/base-component';
import { Player } from '../player/player';
import { setting } from '../settings/setting';
import './lobby.css';

export class Lobby extends BaseComponents {
  private readonly container: HTMLElement;

  private readonly playerFirst: Player;

  private readonly playerSecond: Player;

  private readonly replaysBtn: HTMLLinkElement;

  private readonly startGameBtn: HTMLLinkElement;

  private readonly gameSwitcherBtn: HTMLElement;

  private readonly settingBtn: HTMLLinkElement;

  constructor() {
    super('section', [setting.classNames.lobby.lobby]);

    this.container = createElement([setting.classNames.lobby.container]);
    this.element.appendChild(this.container);

    this.playerFirst = new Player('Player 1');
    this.replaysBtn = document.createElement('a');
    this.replaysBtn.classList.add(setting.classNames.lobby.menu.replay);

  }

  private playerBlockInit(replay: boolean) {
    const playerMenuContainer = document.createElement('div');
    playerMenuContainer.classList.add('player-menu');

  }
}