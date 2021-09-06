import { switcher } from '../../../shared/heigth-switcher';
import { BaseComponents } from '../models/base-conponents';
import { setting } from '../setting-object/setting-object';
import './play-card.css';

const CLEAR_CLASS = 'clear';

export class Card extends BaseComponents {
  readonly image: string;

  private readonly flipClass: string;

  constructor(imageURL = '') {
    super('div', ['play-card']);
    const height = switcher(setting.amountPairs);
    if (setting.amountPairs === 8) {
      this.flipClass = 'flippedFour';
    } else {
      this.flipClass = 'flippedSix';
    }
    this.element.style.width = `calc(16/19*${height})`;
    this.element.style.height = height;
    this.element.innerHTML = `
      <div class="card-front" style="background: url(./images/${imageURL}) center no-repeat; background-size: contain">
        <div class="clear"></div>
      </div>
      <div class="card-back"></div>
    `;
    this.image = imageURL;
  }

  flip() {
    this.element.classList.toggle(this.flipClass);
  }

  success(): Promise<void> {
    return this.correlation('rgb(10, 207, 131)');
  }

  mistake(): Promise<void> {
    return this.correlation('rgb(242, 78, 30)');
  }

  private correlation(background: string): Promise<void> {
    return new Promise((resolve) => {
      const clearElem = <HTMLElement> this.element.querySelector(`.${CLEAR_CLASS}`);
      clearElem.style.background = `${background}`;
      clearElem.style.opacity = '0.5';
      clearElem.addEventListener(
        'transitionend',
        () => {
          clearElem.style.opacity = '0';
          return resolve();
        },
        { once: true },
      );
    });
  }
}
