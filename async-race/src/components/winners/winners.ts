import { createSwitchBtns } from '../../../shared/switch-btns';
import { API } from '../API/API';
import { Car } from '../car/car';
import { Field } from '../models/field/field';
import { Query } from '../models/query-interface';
import { Score } from '../score/score';
import { setting } from '../setting';

const QUERYES = [{ key: '_page', value: String(setting.activeWinnerSetting.page) },
  { key: '_limit', value: String(setting.activeWinnerSetting.limit) },
  { key: '_sort', value: String(setting.activeWinnerSetting.sort) },
  { key: '_order', value: String(setting.activeWinnerSetting.order) },
];

export class Winners extends Field {
  private scores: Score[] = [];

  private scoresContainer: HTMLElement;

  private winnersCounter?: HTMLSpanElement;

  private pageCounter?: HTMLSpanElement;

  private prevPage?: HTMLButtonElement;

  private nextPage?: HTMLButtonElement;

  constructor() {
    super(['winners'], 'winners__container');

    this.scoresContainer = document.createElement('div');
    this.contantsField.element.appendChild(this.scoresContainer);

    this.createWinnerCounterAndPageCounter();

    this.getWinners(QUERYES);

    this.createPageSwitchBtns();
  }

  private createWinnerCounterAndPageCounter() {
    const winnersCounterElement = document.createElement('h2');
    winnersCounterElement.classList.add('garage-counter');
    winnersCounterElement.innerHTML = `
      Winners (<span></span>)
    `;
    this.contantsField.element.appendChild(winnersCounterElement);
    this.winnersCounter = <HTMLSpanElement> winnersCounterElement.querySelector('span');

    const pageCounterElement = document.createElement('h3');
    pageCounterElement.classList.add('page-counter');
    pageCounterElement.innerHTML = `
      Page #<span></span>
    `;
    this.contantsField.element.appendChild(pageCounterElement);
    this.pageCounter = <HTMLSpanElement> pageCounterElement.querySelector('span');
  }

  private createPageSwitchBtns() {
    const btnsContainer = document.createElement('div');
    btnsContainer.classList.add('switch-page__container');
    this.contantsField.element.appendChild(btnsContainer);

    this.prevPage = createSwitchBtns('prev');
    btnsContainer.appendChild(this.prevPage);
    this.prevPage.addEventListener('click', () => {
      if (setting.activeWinnerSetting.page > 1) {
        setting.activeWinnerSetting.page--;
        this.getWinners(QUERYES);
      }
    });

    this.nextPage = createSwitchBtns('next');
    btnsContainer.appendChild(this.nextPage);
    this.nextPage.addEventListener('click', () => {
      setting.activeWinnerSetting.page++;
      this.getWinners(QUERYES);
    });
  }

  private async getWinners(queryes: Query[]) {
    this.scoresContainer.innerHTML = '';
    const response = await API.getAllWinner(queryes);
    if (this.winnersCounter) {
      this.winnersCounter.innerHTML = String(response.totalCount);
    }
    queryes.forEach((query) => {
      if (query.key === '_page' && this.pageCounter) {
        this.pageCounter.innerHTML = query.value;
      }
    });
    for (let i = 0; i < response.winners.length; i++) {
      const carData = await API.getCar(response.winners[i].id);
      if (carData.name) {
        const car = new Car(carData);
        const score = new Score(i + 1, car, response.winners[i]);
        this.scores.push(score);
        this.scoresContainer.appendChild(score.element);
      } else {
        await API.deleteWinner(response.winners[i].id);
        this.getWinners(queryes);
        return;
      }
    }
  }
}
