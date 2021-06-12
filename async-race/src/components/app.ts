import { Field } from './models/field/field';
import './app.css';
import { Garage } from './garage/garage';
import { Winners } from './winners/winners';

export class App extends Field {
  private garageButton?: HTMLButtonElement;

  private scoreButton?: HTMLButtonElement;

  private garage?: Garage;

  private winners?: Winners;

  constructor(private readonly rootElement: HTMLElement) {
    super(['header'], 'header');
    this.rootElement.appendChild(this.element);
    this.createNavBtns();
    this.startGarage();
  }

  private createNavBtns() {
    this.garageButton = document.createElement('button');
    this.garageButton.classList.add('confirm-btn', 'header__btn');
    this.garageButton.innerHTML = 'to Garage';
    this.contantsField.element.appendChild(this.garageButton);
    this.garageButton.addEventListener('click', () => {
      this.startGarage();
    });

    this.scoreButton = document.createElement('button');
    this.scoreButton.classList.add('confirm-btn', 'header__btn');
    this.scoreButton.innerHTML = 'to Score';
    this.contantsField.element.appendChild(this.scoreButton);
    this.scoreButton.addEventListener('click', () => {
      this.startWinners();
    });
  }

  private startGarage() {
    this.cleaning();
    if (!this.garage) {
      this.garage = new Garage();
    }
    this.rootElement.appendChild(this.garage.element);
  }

  private startWinners() {
    this.cleaning();
    if (!this.winners) {
      this.winners = new Winners();
    }
    this.rootElement.appendChild(this.winners.element);
  }

  private cleaning() {
    if (this.garage) {
      this.garage.element.remove();
    }
    if (this.winners) {
      this.winners.element.remove();
    }
  }
}
