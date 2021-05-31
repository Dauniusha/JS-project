import './setting.css';
import { Field } from '../field-components';
import { setting } from '../setting-object/setting-object';
import { storage } from '../data-base/data-base-elem';
import { BaseComponents } from '../base-conponents';

const MENU_OPEN = 'menu-open';
const MENU_ACTIVE = 'menu_active';

export class Setting extends Field {
  private difficultys: HTMLElement[] = [];

  private types: HTMLElement[] = [];

  private typeMenu?: HTMLElement;

  private difficultyMenu?: HTMLElement;

  private newPlayer: BaseComponents;

  constructor() {
    super('setting', 'setting-container');
    this.contantsField.element.innerHTML = `
      <div class="slide-menu" id="card-type">
        <h2 class="title">Game cards</h2>
        <p class="description__text setting__description">select game cards type
          <span class="vector"></span>
        </p>
        <ul class="menu-inner" id="type-menu__inner">
          <li class="menu__inner-each" data-type="animal">
            <p class="description__text menu__text">Animal</p>
            <img class="description__img" src="" alt="animal">
          </li>
          <li class="menu__inner-each menu_active" data-type="space">
            <p class="description__text menu__text">Space</p>
            <img class="description__img" src="./images/space/pluto.svg" alt="space">
          </li>
          <li class="menu__inner-each" data-type="transport">
            <p class="description__text menu__text">Transport</p>
            <img class="description__img" src="./images/transport/car.svg" alt="transport">
          </li>
          <li class="menu__inner-each" data-type="anything">
            <p class="description__text menu__text">Anything</p>
            <img class="description__img" src="" alt="">
          </li>
        </ul>
      </div>
      <div class="slide-menu" id="difficulty">
        <h2 class="title">Difficulty</h2>
        <p class="description__text setting__description">select game type
          <span class="vector"></span>
        </p>
        <ul class="menu-inner" id="difficulty-menu__inner">
          <li class="menu__inner-each menu_active" data-difficulty="4">
            <p class="description__text menu__text">4 * 4</p>
          </li>
          <li class="menu__inner-each" data-difficulty="6">
            <p class="description__text menu__text">6 * 6</p>
          </li>
        </ul>
      </div>
    `;
    this.newPlayer = new BaseComponents('div', ['add-player']);
    this.contantsField.element.appendChild(this.newPlayer.element);
    this.newPlayer.element.title = 'Add new player :)';
  }

  initSetting() {
    this.typeMenu = <HTMLElement>document.getElementById('card-type');
    this.contantsField.element.querySelectorAll('li[data-type]').forEach((elem) => {
      this.types.push(<HTMLElement>elem);
    });
    this.difficultyMenu = <HTMLElement>document.getElementById('difficulty');
    this.contantsField.element.querySelectorAll('li[data-difficulty]').forEach((elem) => {
      this.difficultys.push(<HTMLElement>elem);
    });
    this.changeSetting();
  }

  private changeSetting() {
    this.typeMenu?.addEventListener('click', (event) => {
      if ((<Element>event.target).closest('.setting__description')) {
        this.typeMenu?.classList.toggle(MENU_OPEN);
        this.typeMenu?.querySelector('.vector')?.classList.toggle('vector-open');
      }
    });
    this.difficultyMenu?.addEventListener('click', (event) => {
      if ((<Element>event.target).closest('.setting__description')) {
        this.difficultyMenu?.classList.toggle(MENU_OPEN);
        this.difficultyMenu?.querySelector('.vector')?.classList.toggle('vector-open');
      }
    });
    document.getElementById('type-menu__inner')?.addEventListener('click', (event) => {
      this.chooseSetting(event);
    });
    document.getElementById('difficulty-menu__inner')?.addEventListener('click', (event) => {
      this.chooseSetting(event);
    });
  }

  private chooseSetting(event: Event) {
    const elem = <HTMLElement>(<Element>event.target).closest('.menu__inner-each');
    if (elem) {
      if (elem.dataset.type) {
        this.types.forEach((type) => {
          type.classList.remove(MENU_ACTIVE);
        });
        elem.classList.add(MENU_ACTIVE);
        setting.category = elem.dataset.type;
      } else if (elem.dataset.difficulty) {
        this.difficultys.forEach((difficulty) => {
          difficulty.classList.remove(MENU_ACTIVE);
        });
        elem.classList.add(MENU_ACTIVE);
        switch (elem.dataset.difficulty) {
          case '4':
            setting.amountPairs = 4 ** 4 / 2;
            break;
          case '6':
            setting.amountPairs = 6 ** 6 / 2;
            break;
          default:
            break;
        }
      }
      storage.addUserAndSetting();
    }
  }

  getNewPlayerBtn() {
    return this.newPlayer;
  }
}
