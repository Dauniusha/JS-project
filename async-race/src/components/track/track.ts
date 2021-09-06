import './track.css';
import { Car } from '../car/car';
import { BaseComponents } from '../models/base-component';
import { API } from '../API/API';
import { APISettings } from '../API/API-setting';
import { setting } from '../setting';
import { CarDataInterface } from '../models/car-interface';

export class Track extends BaseComponents {
  private car: Car;

  selectButton?: HTMLButtonElement;

  removeButton?: HTMLButtonElement;

  private startButton?: HTMLButtonElement;

  private stopButton?: HTMLButtonElement;

  private readonly carElement: HTMLElement;

  constructor(car: Car) {
    super('div', ['track']);

    this.car = car;

    this.createSettingContainer();

    this.createTrackWithButtons();
    const carElement = <HTMLElement> this.element.querySelector('.car');
    if (carElement) {
      this.carElement = carElement;
    } else {
      throw Error('Car element does not exist!');
    }
    this.startButton?.addEventListener('click', () => {
      this.carStart();
    });
    this.stopButton?.addEventListener('click', () => {
      this.carStop();
    });
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
    this.stopButton.classList.add('track-btn', 'stop-btn', setting.offClasses.trackBtnOffClass);
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
    API.deleteWinner(this.car.id);
    return API.deleteCar(this.car.id);
  }

  getCar(): Car {
    return this.car;
  }

  setCar(car: Car) {
    this.car = car;
  }

  getCarElement(): HTMLElement {
    return this.carElement;
  }

  private async carStart() {
    this.toggleTrackBtns();
    const carData = await API.toggleCarsEngine([{ key: 'id', value: String(this.car.id) }, {
      key: 'status', value: APISettings.status.start,
    }]);
    this.carAnimationOn(carData);
    const driveModeOn = await API.switchToDriveMode([{ key: 'id', value: String(this.car.id) }, {
      key: 'status', value: APISettings.status.drive,
    }]);
    if (!driveModeOn) {
      this.carElement.style.animationPlayState = 'paused';
    }
  }

  async carStop(): Promise<void> {
    return new Promise(async (resolve) => {
      this.stopButton?.classList.add(setting.offClasses.trackBtnOffClass);
      await API.switchToDriveMode([{ key: 'id', value: String(this.car.id) }, {
        key: 'status', value: APISettings.status.stop,
      }]);
      this.carAnimationOff();
      this.startButton?.classList.remove(setting.offClasses.trackBtnOffClass);
      resolve();
    });
  }

  private carAnimationOn(carData: CarDataInterface) {
    this.carElement.style.animationDuration = `${carData.distance / 1000 / carData.velocity}s`;
    this.carElement.classList.add(setting.animationClass.on);
    this.carElement.style.animationPlayState = 'running';
  }

  private carAnimationOff() {
    this.carElement.classList.remove(setting.animationClass.on);
  }

  private toggleTrackBtns() {
    this.startButton?.classList.toggle(setting.offClasses.trackBtnOffClass);
    this.stopButton?.classList.toggle(setting.offClasses.trackBtnOffClass);
  }

  carRaceStart(): Promise<Track> {
    return new Promise((resolve) => {
      this.carStart();
      this.carElement.addEventListener('animationend', () => {
        resolve(this);
      });
    });
  }
}
