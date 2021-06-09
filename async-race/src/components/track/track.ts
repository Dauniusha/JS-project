import './track.css';
import { Car } from '../car/car';
import { BaseComponents } from '../models/base-component';
import { API } from '../API/API';

export class Track extends BaseComponents {
  private car: Car;

  selectButton?: HTMLButtonElement;

  removeButton?: HTMLButtonElement;

  private startButton?: HTMLButtonElement;

  private stopButton?: HTMLButtonElement;

  constructor(car: Car) {
    super('div', ['track']);

    this.car = car;

    this.createSettingContainer();

    this.createTrackWithButtons();
  }

  private createSettingContainer() {
    const settingButonsContainer = document.createElement('div');
    settingButonsContainer.classList.add('setting-container');
    this.element.appendChild(settingButonsContainer);

    this.selectButton = document.createElement('button');
    this.selectButton.classList.add('control-btn', 'select-btn');
    this.selectButton.innerHTML = 'select';
    settingButonsContainer.appendChild(this.selectButton);

    this.removeButton = document.createElement('button');
    this.removeButton.classList.add('control-btn', 'remove-btn');
    this.removeButton.innerHTML = 'remove';
    settingButonsContainer.appendChild(this.removeButton);

    const carName = document.createElement('p');
    carName.classList.add('car-type');
    carName.innerHTML = this.car.name;
    settingButonsContainer.appendChild(carName);
  }

  private createTrackWithButtons() {
    const trackContainer = document.createElement('div');
    trackContainer.classList.add('track-container');
    this.element.appendChild(trackContainer);

    const trackButtonsContainer = document.createElement('div');
    trackButtonsContainer.classList.add('track-btns-container');
    trackContainer.appendChild(trackButtonsContainer);

    this.startButton = document.createElement('button');
    this.startButton.classList.add('track-btn', 'start-btn');
    this.startButton.innerHTML = 'S';
    trackButtonsContainer.appendChild(this.startButton);

    this.stopButton = document.createElement('button');
    this.stopButton.classList.add('track-btn', 'stop-btn', 'track-btn-disable');
    this.stopButton.innerHTML = 'B';
    trackButtonsContainer.appendChild(this.stopButton);

    const carImg = document.createElement('div');
    carImg.classList.add('car'); // нужная картинка
    if (this.car.svg) {
      carImg.innerHTML = this.car.svg;
    } else {
      console.log('Have not svg!');
    }
    const svg = carImg.querySelector('svg'); // Через QS, чтобы не перекрасить все остальные такие же svg
    if (svg) {
      svg.style.fill = this.car.color;
    } // Можно добавить исключение
    trackContainer.appendChild(carImg);

    const finishFlag = document.createElement('img');
    finishFlag.src = './finish.svg';
    finishFlag.classList.add('finish-flag');
    trackContainer.appendChild(finishFlag);
  }

  deleteCar(): Promise<void> {
    return API.deleteCar(this.car.id);
  }

  getCar(): Car {
    return this.car;
  }

  setCar(car: Car) {
    this.car = car;
  }
}
