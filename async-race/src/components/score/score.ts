import { Car } from '../car/car';
import { BaseComponents } from '../models/base-component';
import { Winner } from '../models/winner-interface';

export class Score extends BaseComponents {
  private readonly place: number;

  private readonly car: Car;

  private readonly winData: Winner;

  constructor(place: number, car: Car, winData: Winner) {
    super('div', ['score']);
    this.place = place;
    this.car = car;
    this.winData = winData;
    this.createScoreTable();
  }

  private createScoreTable() {
    const placeContainer = Score.createDivElement('place-container');
    placeContainer.innerHTML = String(this.place);
    this.element.appendChild(placeContainer);

    const carImgContainer = Score.createDivElement('car-container');
    if (this.car.svg) {
      carImgContainer.innerHTML = this.car.svg;
    }
    const svg = carImgContainer.querySelector('svg');
    if (svg) {
      svg.style.fill = this.car.color;
    }
    this.element.appendChild(carImgContainer);

    const nameContainer = Score.createDivElement('name-container');
    nameContainer.innerHTML = this.car.name;
    this.element.appendChild(nameContainer);

    const winsContainer = Score.createDivElement('wins-container');
    winsContainer.innerHTML = String(this.winData.wins);
    this.element.appendChild(winsContainer);

    const bestTimeContainer = Score.createDivElement('best-time-container');
    bestTimeContainer.innerHTML = String(this.winData.time);
    this.element.appendChild(bestTimeContainer);
  }

  private static createDivElement(className: string): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(className);
    return container;
  }
}
