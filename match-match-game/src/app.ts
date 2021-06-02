import { About } from './components/about-page/about';
import { storage } from './components/data-base/data-base-elem';
import { Field } from './components/models/field-components';
import { Game } from './components/game/game';
import { Header } from './components/header/header';
import { RegisterPopup } from './components/register-popup/register-popup';
import { Router } from './components/route/route';
import { Scores } from './components/scores/scores-field';
import { Setting } from './components/setting/setting';

export class App {
  private header: Header;

  private readonly contantElement: HTMLElement;

  private game?: Game;

  private about?: About;

  private scores?: Scores;

  private setting?: Setting;

  router: Router;

  private regPopup?: RegisterPopup;

  private isFirst = true;

  constructor(private readonly rootElement: HTMLElement) {
    this.initDB();

    this.header = new Header();
    this.rootElement.appendChild(this.header.element);
    this.header.getRegBtn()?.addEventListener('click', () => {
      this.createRegpopup();
    });

    this.contantElement = document.createElement('div');
    this.rootElement.appendChild(this.contantElement);

    this.router = new Router();
    this.initRoute();
    this.navRoute();
    if (window.location.hash) {
      this.header.changeActiveRoute(window.location.hash);
    }
  }

  private async initDB() {
    await storage.createDataBase();
    await storage.getUserAndSetting();
    this.header.refreshCheck(storage.user?.firstName, storage.user?.avatarURL); // Попадает в макротаски
  }

  private initRoute() {
    this.router.add({
      page: 'about',
      hash: '#/About',
      needFoo: () => {
        this.startAbout();
      },
    });
    this.router.add({
      page: 'game',
      hash: '#/Game',
      needFoo: () => {
        this.startGame();
      },
    });
    this.router.add({
      page: 'scores',
      hash: '#/Scores',
      needFoo: () => {
        this.startScores();
      },
    });
    this.router.add({
      page: 'setting',
      hash: '#/Setting',
      needFoo: () => {
        this.startSetting();
      },
    });
  }

  private navRoute() {
    this.header.element.addEventListener('click', (elem) => {
      const parentElem = (<Element>elem.target).closest('.nav__inner');
      if (parentElem) {
        const { hash } = (<HTMLElement>parentElem).dataset;
        if (!hash) {
          throw Error('Page does not exist!');
        } else {
          this.header.changeActiveRoute(hash);
        }
      }
    });
  }

  private createRegpopup() {
    this.regPopup = new RegisterPopup();
    this.rootElement.appendChild(this.regPopup.element);
    this.regPopup.showRegisterPopup().then(() => {
      if (this.regPopup) {
        this.rootElement.removeChild(this.regPopup.element);
        this.regPopup = undefined;
      }
    });
    this.regPopup.getForm()?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (this.regPopup) {
        this.regPopup.getAllData();
        await this.regPopup.cancel();
        this.rootElement.removeChild(this.regPopup.element);
        this.regPopup = undefined;
      } else {
        throw Error('Popup does not exist');
      }
      this.header.changeAvatar(storage.user?.avatarURL);
      this.header.toggleBtn();
      storage.addUserAndSetting();
    });
  }

  async startGame() {
    this.contantElement.innerHTML = '';
    this.game = new Game();
    const field = new Field('game', 'main-game');
    this.contantElement.appendChild(field.element);
    await this.game.start(field.contantsField.element);
    if (this.isFirst) { // Тоже очень неприятный костыль, не знаю как фиксить, потому что с каждым разом невешиваются listner'ы
      this.header.toggleStartBtn();
      this.header.startActive = false;
      this.header.getStartBtn()?.addEventListener('click', () => {
        this.header.toggleStartBtn();
        this.header.startActive = !this.header.startActive;
        this.game?.timer.stopTimer();
      });

      this.isFirst = false;
    }
  }

  startAbout() {
    this.headerChecker();
    this.contantElement.innerHTML = '';
    if (!this.about) {
      this.about = new About();
    }
    this.contantElement.appendChild(this.about.element);
  }

  startScores() {
    this.header.changeActiveRoute(window.location.hash);
    this.headerChecker();
    this.contantElement.innerHTML = '';
    this.scores = new Scores();
    this.contantElement.appendChild(this.scores.element);
  }

  async startSetting() {
    this.headerChecker();
    this.contantElement.innerHTML = '';
    this.setting = new Setting();
    this.contantElement.appendChild(this.setting.element);
    await storage.getUserAndSetting(); // Костыль, потом обязательно спросить
    this.setting.initSetting();
    this.setting.getNewPlayerBtn().element.addEventListener('click', () => {
      this.createRegpopup();
    });
  }

  private headerChecker() {
    if (!this.header.startActive) {
      this.header.toggleStartBtn();
      this.header.startActive = true;
    }
  }
}
