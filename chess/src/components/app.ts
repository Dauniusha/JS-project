import { storage } from "./data-base/data-base-element";
import { Footer } from "./footer/footer";
import { Game } from "./game/game";
import { Header } from "./header/header";
import { Lobby } from "./lobby/lobby";
import { Router } from "./route/route";
import { setting } from "./settings/setting";

export class App {
  private header: Header;

  private footer: Footer;

  private lobby?: Lobby;

  private game?: Game;

  readonly router: Router;

  private activePage?: Lobby | Game;

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
    this.rootElement.insertBefore(this.lobby.element, this.footer.element);
  }

  private startSettingPage() {

  }

  private startGamePage() {
    this.clearWindow();
    this.game = new Game();
    this.activePage = this.game;
    this.rootElement.insertBefore(this.game.element, this.footer.element);
  }

  private startReplaysPage() {

  }

  private clearWindow() {
    this.activePage?.element.remove();
  }
}