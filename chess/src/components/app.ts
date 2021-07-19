import { storage } from "./data-base/data-base-element";
import { Footer } from "./footer/footer";
import { Game } from "./game/game";
import { Header } from "./header/header";
import { Lobby } from "./lobby/lobby";
import { ReplaysDBObject } from "./models/data-base/data-base-replays-object";
import { OnlineGame } from "./online-game/online-game";
import { Replays } from "./replays/replays";
import { Router } from "./route/route";
import { setting } from "./settings/setting";
import { WatchReplay } from "./watch-replays/replays-watch";

export class App {
  private header: Header;

  private footer: Footer;

  private lobby?: Lobby;

  private game?: Game | OnlineGame;

  private replays?: Replays;

  private watchReplay?: WatchReplay;

  readonly router: Router;

  private activePage?: Lobby | Game | Replays | WatchReplay;

  constructor(private readonly rootElement: HTMLElement) {
    this.initDB();

    this.header = new Header();
    this.rootElement.appendChild(this.header.element);

    this.footer = new Footer();
    this.rootElement.appendChild(this.footer.element);

    this.router = new Router();
    // this.initRoute();
  }

  private async initDB() {
    await storage.createDataBase();
    this.initRoute();
  }

  private initRoute() {
    this.router.add({
      pageName: 'watch-replays',
      hash: 'Watch-replay',
      needFoo: () => this.startWatchReplay(),
    });

    this.router.add({
      pageName: 'lobby',
      hash: '#/Lobby',
      needFoo: () => this.startLobbyPage(),
    });

    this.router.add({
      pageName: 'setting',
      hash: '#/Setting',
      needFoo: () => this.startSettingPage(),
    });

    this.router.add({
      pageName: 'game',
      hash: '#/Game',
      needFoo: () => this.startGamePage(),
    });

    this.router.add({
      pageName: 'replays',
      hash: '#/Replays',
      needFoo: () => this.startReplaysPage(),
    });
  }

  private startLobbyPage() {
    this.clearWindow();
    if (!this.lobby) {
      this.lobby = new Lobby();
    }
    this.activePage = this.lobby;
    this.lobby.resetColorAndSocket();
    this.rootElement.insertBefore(this.lobby.element, this.footer.element);
  }

  private startSettingPage() {

  }

  private startGamePage() {
    this.clearWindow();
    if (this.lobby?.socket && this.lobby.color) {
      this.game = new OnlineGame(this.lobby.color, this.lobby.socket);
      
    } else {
      this.game = new Game();
      this.game.chessBoardListnersInit();
    }
    this.activePage = this.game;
    this.rootElement.insertBefore(this.game.element, this.footer.element);
  }

  private startReplaysPage() {
    this.clearWindow();
    this.replays = new Replays();
    this.activePage = this.replays;
    this.rootElement.insertBefore(this.replays.element, this.footer.element);
  }

  private async startWatchReplay() {
    this.clearWindow();
    const replay = await App.getReplay();
    const btns = this.header.createReplayBtns();
    this.initReplayBtnsListners(btns.previousBtn, btns.nextBtn);
    this.watchReplay = new WatchReplay(replay);
    this.activePage = this.watchReplay;
    this.rootElement.insertBefore(this.watchReplay.element, this.footer.element);
  }

  private static async getReplay(): Promise<ReplaysDBObject> {
    return new Promise( async (resolve) => {
      const location = window.location.hash;
      const locationToken = location.split('/');
      const replayPosition = locationToken[ locationToken.length - 1 ];
  
      const allReplays = await storage.getReplays();
      const replay = allReplays[Number(replayPosition)];
      resolve(replay);
    }); 
  }

  private initReplayBtnsListners(previousBtn: HTMLElement, nextBtn: HTMLElement) {
    previousBtn.addEventListener('click', () => {
      this.watchReplay?.makeMove(false);
    });
    nextBtn.addEventListener('click', () => {
      this.watchReplay?.makeMove(true);
    });
  }

  private clearWindow() {
    this.activePage?.element.remove();
  }
}