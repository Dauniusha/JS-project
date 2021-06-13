import { Field } from './models/field/field';
import './app.css';
import { Garage } from './garage/garage';
import { Winners } from './winners/winners';
import { setting } from './setting';

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
    this.garageButton.classList.add('confirm-btn', 'header__btn', 'disable');
    this.garageButton.innerHTML = 'to Garage';
    this.contantsField.element.appendChild(this.garageButton);
    this.garageButton.addEventListener('click', () => {
      this.toggleBtns();
      this.startGarage();
    });

    this.scoreButton = document.createElement('button');
    this.scoreButton.classList.add('confirm-btn', 'header__btn');
    this.scoreButton.innerHTML = 'to Score';
    this.contantsField.element.appendChild(this.scoreButton);
    this.scoreButton.addEventListener('click', () => {
      this.toggleBtns();
      this.startWinners();
    });
  }

  private startGarage() {
    if (!this.garage) {
      this.garage = new Garage();
      this.rootElement.appendChild(this.garage.element);
      this.garage.element.classList.add('show-class');
    }
    this.toogleElement();
  }

  private startWinners() {
    if (!this.winners) {
      this.winners = new Winners();
      this.rootElement.appendChild(this.winners.element);
      this.winners.element.classList.add('show-class');
    }
    this.toogleElement();
  }

  private toggleBtns() {
    this.garageButton?.classList.toggle('disable');
    this.scoreButton?.classList.toggle('disable');
  }

  private toogleElement() {
    this.garage?.element.classList.toggle('show-class');
    this.winners?.element.classList.toggle('show-class');
  }
}
