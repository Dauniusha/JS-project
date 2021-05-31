import { switcher } from '../../../shared/heigth-switcher';
import { BaseComponents } from '../base-conponents';
import { Card } from '../play-card/play-card';
import { setting } from '../setting.ts/setting-object';
import './cards-field.css';

const SHOW_TIME = 3;

export class CardsField extends BaseComponents {
  private cards: Card[] = [];

  constructor() {
    super('div', ['cards-field']);
    this.element.style.width = `calc(16/19*${Math.sqrt(setting.amountPairs * 2) + 1}*${switcher(setting.amountPairs)})`;
  }

  clear() {
    this.cards = [];
    this.element.innerHTML = '';
  }

  addCard(cards: Card[]): Promise<void> {
    return new Promise((resolve) => {
      this.cards = cards;
      this.cards.forEach((card) => {
        this.element.appendChild(card.element);
      });
      setTimeout(() => {
        this.cards.forEach((card) => {
          card.flip();
          return resolve();
        });
      }, SHOW_TIME * 1000);
    });
  }
}
