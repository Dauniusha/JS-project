import './winners.css';
import { createSwitchBtns } from '../../../shared/switch-btns';
import { API } from '../API/API';
import { Car } from '../car/car';
import { Field } from '../models/field/field';
import { Query } from '../models/query-interface';
import { Score } from '../score/score';
import { setting } from '../setting';
import { createDivElement } from '../../../shared/create-div';

export class Winners extends Field {
  private scores: Score[] = [];

  private scoresContainer: HTMLElement;

  private scoresTemplate?: HTMLElement;

  private winnersCounter?: HTMLSpanElement;

  private pageCounter?: HTMLSpanElement;

  private prevPage?: HTMLButtonElement;

  private nextPage?: HTMLButtonElement;

  private winsElement?: HTMLElement;

  private timeElement?: HTMLElement;

  constructor() {
    super(['winners'], 'winners__container');

    this.createWinnerCounterAndPageCounter();

    this.createScoresTemplate();

    this.scoresContainer = document.createElement('div');
    this.contantsField.element.appendChild(this.scoresContainer);

    this.getWinners([{ key: '_page', value: String(setting.activeWinnerSetting.page) },
      { key: '_limit', value: String(setting.activeWinnerSetting.limit) },
      { key: '_sort', value: String(setting.activeWinnerSetting.activeSort.sort) },
      { key: '_order', value: String(setting.activeWinnerSetting.activeSort.order) },
    ]);

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
        this.getWinners([{ key: '_page', value: String(setting.activeWinnerSetting.page) },
          { key: '_limit', value: String(setting.activeWinnerSetting.limit) },
          { key: '_sort', value: String(setting.activeWinnerSetting.activeSort.sort) },
          { key: '_order', value: String(setting.activeWinnerSetting.activeSort.order) },
        ]);
      }
    });

    this.nextPage = createSwitchBtns('next');
    btnsContainer.appendChild(this.nextPage);
    this.nextPage.addEventListener('click', () => {
      setting.activeWinnerSetting.page++;
      this.getWinners([{ key: '_page', value: String(setting.activeWinnerSetting.page) },
        { key: '_limit', value: String(setting.activeWinnerSetting.limit) },
        { key: '_sort', value: String(setting.activeWinnerSetting.activeSort.sort) },
        { key: '_order', value: String(setting.activeWinnerSetting.activeSort.order) },
      ]);
    });
  }

  private pageButtonsValidation() {
    if (setting.activeWinnerSetting.page <= 1) {
      this.prevPage?.classList.add('disable');
    } else {
      this.prevPage?.classList.remove('disable');
    }
    const garageCount = this.winnersCounter?.innerHTML;
    if (setting.activeWinnerSetting.page >= Math.ceil(Number(garageCount) / setting.activeWinnerSetting.limit)) {
      this.nextPage?.classList.add('disable');
    } else {
      this.nextPage?.classList.remove('disable');
    }
  }

  private createScoresTemplate() {
    this.scoresTemplate = createDivElement(['score', 'score-template']);
    this.contantsField.element.appendChild(this.scoresTemplate);

    const place = createDivElement(['place-container']);
    place.innerHTML = '#';
    this.scoresTemplate.appendChild(place);

    const car = createDivElement(['car-container']);
    car.innerHTML = 'Car';
    this.scoresTemplate.appendChild(car);

    const name = createDivElement(['name-container']);
    name.innerHTML = 'Name';
    this.scoresTemplate.appendChild(name);

    this.createWinsElement();

    this.createTimeElement();
  }

  async getWinners(queryes: Query[]) {
    this.scoresContainer.innerHTML = '';
    this.scores.length = 0;
    const response = await API.getAllWinner(queryes);
    if (this.winnersCounter) {
      this.winnersCounter.innerHTML = String(response.totalCount);
    }
    this.pageButtonsValidation();
    queryes.forEach((query) => {
      if (query.key === '_page' && this.pageCounter) {
        this.pageCounter.innerHTML = query.value;
      }
    });
    for (let i = 0; i < response.winners.length; i++) {
      const carData = await API.getCar(response.winners[i].id);
      if (carData.name) {
        const car = new Car(carData);
        const score = new Score((Number(this.pageCounter?.innerHTML) - 1) * setting.activeWinnerSetting.limit + i + 1, car, response.winners[i]);
        this.scores.push(score);
        this.scoresContainer.appendChild(score.element);
      } else { // Всё удаляется при удалении машинок, но это на всякий случай, потому что при удалении через условный постман НЕ удалится винер
        await API.deleteWinner(response.winners[i].id);
        this.getWinners(queryes);
        return;
      }
    }
  }

  private sortDataWinner(name: string, sortMode: string) {
    const querys: Query[] = [
      { key: '_page', value: String(setting.activeWinnerSetting.page) },
      { key: '_limit', value: String(setting.activeWinnerSetting.limit) },
    ];
    switch (name) {
      case setting.activeWinnerSetting.sort.wins:
        setting.activeWinnerSetting.activeSort.sort = setting.activeWinnerSetting.sort.wins;
        querys.push({ key: '_sort', value: String(setting.activeWinnerSetting.activeSort.sort) });
        break;
      case setting.activeWinnerSetting.sort.time:
        setting.activeWinnerSetting.activeSort.sort = setting.activeWinnerSetting.sort.time;
        querys.push({ key: '_sort', value: String(setting.activeWinnerSetting.activeSort.sort) });
        break;
      default:
        console.log('Something wrong!');
    }
    switch (sortMode) {
      case setting.activeWinnerSetting.order.asc:
        setting.activeWinnerSetting.activeSort.order = setting.activeWinnerSetting.order.asc;
        querys.push({ key: '_order', value: String(setting.activeWinnerSetting.activeSort.order) });
        break;
      case setting.activeWinnerSetting.order.desc:
        setting.activeWinnerSetting.activeSort.order = setting.activeWinnerSetting.order.desc;
        querys.push({ key: '_order', value: String(setting.activeWinnerSetting.activeSort.order) });
        break;
      default:
        console.log('Something wrong!');
    }
    this.getWinners(querys);
  }

  private createWinsElement() {
    this.winsElement = createDivElement(['wins-container', 'wins-template']);
    this.winsElement.innerHTML = 'Wins';
    if (!this.scoresTemplate) {
      throw Error('Error!');
    }
    this.scoresTemplate.appendChild(this.winsElement);
    this.winsElement.addEventListener('click', () => {
      if (!this.winsElement) {
        throw Error('Error!');
      }
      if (this.winsElement.classList.contains('active-field')) {
        if (this.winsElement.classList.contains('ASC-sort')) {
          this.winsElement.classList.remove('ASC-sort');
          this.sortDataWinner(setting.activeWinnerSetting.sort.wins, setting.activeWinnerSetting.order.desc);
        } else {
          this.winsElement.classList.add('ASC-sort');
          this.sortDataWinner(setting.activeWinnerSetting.sort.wins, setting.activeWinnerSetting.order.asc);
        }
      } else {
        this.winsElement?.classList.add('active-field');
        this.sortDataWinner(setting.activeWinnerSetting.sort.wins, setting.activeWinnerSetting.order.desc);
        this.timeElement?.classList.remove('active-field', 'ASC-sort');
      }
    });
  }

  private createTimeElement() { // Можно поместить в одну функцию, но экзамены(
    this.timeElement = createDivElement(['best-time-container', 'best-time-template']);
    this.timeElement.innerHTML = 'Best time (seconds)';
    if (!this.scoresTemplate) {
      throw Error('Error!');
    }
    this.scoresTemplate.appendChild(this.timeElement);
    this.timeElement.addEventListener('click', () => {
      if (!this.timeElement) {
        throw Error('Error!');
      }
      if (this.timeElement.classList.contains('active-field')) {
        if (this.timeElement.classList.contains('ASC-sort')) {
          this.timeElement.classList.remove('ASC-sort');
          this.sortDataWinner(setting.activeWinnerSetting.sort.time, setting.activeWinnerSetting.order.desc);
        } else {
          this.timeElement.classList.add('ASC-sort');
          this.sortDataWinner(setting.activeWinnerSetting.sort.time, setting.activeWinnerSetting.order.asc);
        }
      } else {
        this.timeElement?.classList.add('active-field', 'ASC-sort');
        this.sortDataWinner(setting.activeWinnerSetting.sort.time, setting.activeWinnerSetting.order.asc);
        this.winsElement?.classList.remove('active-field', 'ASC-sort');
      }
    });
  }
}
