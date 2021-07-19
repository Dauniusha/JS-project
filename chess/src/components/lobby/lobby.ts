import { createElement } from '../../shared/create-element';
import { storage } from '../data-base/data-base-element';
import { BaseComponents } from '../models/base-component';
import { Player } from '../player/player';
import { setting } from '../settings/setting';
import './lobby.css';

export class Lobby extends BaseComponents {
  private readonly container: HTMLElement;

  private readonly playerFirst: Player;

  private readonly playerSecond: Player;

  private readonly replaysBtn: HTMLAnchorElement;

  private readonly startGameBtn: HTMLAnchorElement;

  private readonly gameSwitcherBtn: HTMLElement;

  private readonly settingBtn: HTMLAnchorElement;

  color?: string;

  socket?: WebSocket;

  constructor() {
    super('section', [setting.classNames.lobby.lobby]);

    this.container = createElement([setting.classNames.lobby.container]);
    this.element.appendChild(this.container);

    const firstContainer = this.playerBlockInit();
    this.playerFirst = new Player({ writable: true, counter: 0 });
    this.replaysBtn = Lobby.replaysBtnInit();
    firstContainer.appendChild(this.playerFirst.element);
    firstContainer.appendChild(this.replaysBtn);

    [ this.startGameBtn, this.gameSwitcherBtn ] = Lobby.startBtnAndSwicherInit();
    this.container.appendChild(this.startGameBtn);
    this.initStartListner();
    this.initToogleListner();

    const secondContainer = this.playerBlockInit();
    this.playerSecond = new Player({ writable: true, counter: 1 });
    this.settingBtn = Lobby.settingBtnInit();
    secondContainer.appendChild(this.playerSecond.element);
    secondContainer.appendChild(this.settingBtn);
  }

  private playerBlockInit() {
    const playerMenuContainer = document.createElement('div');
    playerMenuContainer.classList.add('player-menu');
    this.container.appendChild(playerMenuContainer);
    return playerMenuContainer;
  }

  private static replaysBtnInit(): HTMLAnchorElement {
    const btn = document.createElement('a');
    btn.classList.add(setting.classNames.lobby.menu.menu, setting.classNames.lobby.menu.replay);
    btn.href = '#/Replays';
    btn.innerHTML = `
      <p class="${setting.classNames.lobby.menu.replayText}">View replays</p>
      <img class="${setting.classNames.lobby.menu.replayImg}" src="./lobby/replays/play-button.svg" alt="play">
    `;
    return btn;
  }

  private static settingBtnInit(): HTMLAnchorElement {
    const btn = document.createElement('a');
    btn.href = '#/Setting';
    btn.classList.add(setting.classNames.lobby.menu.menu, setting.classNames.lobby.menu.setting);
    btn.innerHTML = `
      <img class="${setting.classNames.lobby.menu.settingImg}" src="./lobby/setting/settings.svg" alt="setting">
    `;
    return btn;
  }

  private static startBtnAndSwicherInit(): [ HTMLAnchorElement, HTMLElement ] { // TODO: Выгрузка режима из БД
    const startBtn = document.createElement('a');
    startBtn.href = '#/Game';
    startBtn.classList.add(setting.classNames.lobby.menu.menu, setting.classNames.lobby.menu.start);
    startBtn.innerHTML = `
      <h2 class="${setting.classNames.lobby.menu.startText}">Start</h2>
    `;

    const gameModeBtn = document.createElement('div');
    gameModeBtn.classList.add(setting.classNames.lobby.menu.menu, setting.classNames.lobby.menu.gameMode);
    gameModeBtn.dataset.mode = 'online';
    gameModeBtn.innerHTML = `
      <div class="game-mode__text" id="online">Online</div>
      <div class="game-mode__text" id="offline">Offline</div>
    `;

    startBtn.appendChild(gameModeBtn);
    
    return [ startBtn, gameModeBtn ];
  }

  private initToogleListner() {
    this.gameSwitcherBtn.addEventListener('click', (event) => {
      event.preventDefault();
      let needDatasetName = 'online';
      if (this.gameSwitcherBtn.dataset.mode === 'online') {
        needDatasetName = 'offline';
      }

      this.startGameBtn.dataset.mode = 'start-' + needDatasetName;
      this.gameSwitcherBtn.dataset.mode = needDatasetName;
    });
  }

  private initStartListner() {
    this.startGameBtn.addEventListener('click', (event) => {
      if (!(<Element>event.target).closest(`.${setting.classNames.lobby.menu.gameMode}`)) {
        if (this.gameSwitcherBtn.dataset.mode === 'online') {
          event.preventDefault();
          this.initSocket();
        } else {
          storage.addPlayer(this.playerFirst.getNameWithAvatar(), 0);
          storage.addPlayer(this.playerSecond.getNameWithAvatar(), 1);
        }
      }
    });
  }

  private initSocket() {
    this.socket = new WebSocket(setting.serverURL);
    this.socket.addEventListener('open', () => {
      if (this.socket) {
        this.socket.addEventListener('message', (event: MessageEvent<string>) => {
          this.newMessage(event.data);
        });
      }
    });
  }

  private newMessage(message: string) {
    switch(message) {
      case 'loading':
        ///
        break;
      case 'connected':
        this.socket?.send(`name ${this.playerFirst.getName()}`);
        this.socket?.send(`avatar ${this.playerFirst.getAvatarURL()}`);
        break;
      case 'white':
      case 'black':
        this.color = message;
        break;
      default:
        const keyValue = message.split(' ');

        switch(keyValue[0]) {
          case 'name':
            this.playerSecond.setName(keyValue.splice(1).join(' '));
            break;
          case 'avatar':
            this.playerSecond.setAvatar(keyValue[1]);
            storage.addPlayer(this.playerFirst.getNameWithAvatar(), 0, this.color);
            storage.addPlayer(this.playerSecond.getNameWithAvatar(), 1);
            window.location.hash = '#/Game';
            break;
          default:
            break;
        }
    }
  }

  resetColorAndSocket() {
    this.color = undefined;
    this.socket = undefined;
  }
}