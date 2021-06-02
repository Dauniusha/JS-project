import './header.css';
import { BaseComponents } from '../models/base-conponents';

const navClassName = '.nav__inner';
const navClassActiveName = 'nav_active';
const regClassName = '.register';
const startClassName = '.user';
enum Route {
  about,
  score,
  setting,
}

export class Header extends BaseComponents {
  private readonly navElements: HTMLElement[] = [];

  private navElementActive: HTMLElement;

  private readonly registerBtn: HTMLElement | null;

  private readonly startBtn: HTMLElement | null;

  private readonly avatarImg: HTMLImageElement;

  startActive = true;

  constructor() {
    super('header', ['header']);
    this.element.innerHTML = `<div class="header-container">
    <div class="logo-nav">
      <h1 class="logo">match<span class="logo__inner">match</span></h1>
      <nav class="nav">
        <a class="nav__inner nav_active" href="#/About" data-hash="#/About">
          <div class="about">
            <span class="about__inner">?</span>
          </div>
          <h3 class="nav__text">About Game</h3>
        </a>
        <a class="nav__inner" href="#/Scores" data-hash="#/Scores">
          <img class="nav__img" src="./Nav/Star.svg" alt="about">
          <h3 class="nav__text">Best Score</h3>
        </a>
        <a class="nav__inner" href="#/Setting" data-hash="#/Setting">
          <div class="about">
            <img class="nav__inner-img" src="./Nav/Setting.svg" alt="about">
          </div>
          <h3 class="nav__text">Game Settings</h3>
        </a>
      </nav>
    </div>
    <div class="user-btn">
      <div class="register active">
        <button class="nav-btn register-btn">
          <span class="add__text">register new player</span>
        </button>
      </div>
      <div class="user">
        <a class="nav-btn start-btn" href="#/Game">
          <span class="add__text">start game</span>
          <span class="add__text start-disactive">stop game</span>
        </a>
        <img class="avatar" src="./Unknown.png" alt="avatar">
      </div>
    </div>`;
    this.element.querySelectorAll(navClassName).forEach((elem) => {
      this.navElements.push(<HTMLElement>elem);
    }); // Потому что <HTMLElement[]> не cработает
    this.navElementActive = <HTMLElement> this.navElements[0];
    this.registerBtn = this.element.querySelector(regClassName);
    this.startBtn = this.element.querySelector(startClassName);
    this.avatarImg = <HTMLImageElement> this.element.querySelector('.avatar');
  }

  private toggleRoute(counter: number) {
    this.navElementActive.classList.remove(navClassActiveName);
    this.navElements[counter].classList.add(navClassActiveName);
    this.navElementActive = this.navElements[counter];
  }

  changeActiveRoute(route: string | undefined) {
    if (!route) {
      throw Error('No current route!');
    }
    switch (route) {
      case '#/About':
        this.toggleRoute(Route.about);
        break;
      case '#/Setting':
        this.toggleRoute(Route.setting);
        break;
      case '#/Game':
        this.navElementActive.classList.remove(navClassActiveName);
        break;
      case '#/Scores':
        this.toggleRoute(Route.score);
        break;
      default:
        throw Error('Invalid route!');
    }
  }

  toggleBtn() {
    this.startBtn?.classList.add('active');
    this.registerBtn?.classList.remove('active');
  }

  refreshCheck(name = '', avatarURL = './Unknown.png') {
    if (name) {
      const img = <HTMLImageElement> this.element.querySelector('.avatar');
      if (img) {
        img.src = avatarURL;
      }
      this.toggleBtn();
    }
  }

  changeAvatar(imageUrl = './Unknown.png') {
    this.avatarImg.src = imageUrl;
  }

  getRegBtn() {
    return this.registerBtn;
  }

  getStartBtn() {
    return this.startBtn;
  }

  toggleStartBtn() {
    const btns = this.element.querySelector('.start-btn')?.childNodes;
    if (!btns) {
      throw Error('Start btn does not exist!');
    }
    btns.forEach((btn) => {
      if ((<HTMLElement>btn).classList) {
        (<HTMLElement>btn).classList.toggle('start-disactive');
      }
    });
  }
}
