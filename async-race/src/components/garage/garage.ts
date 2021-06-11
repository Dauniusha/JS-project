import './garage.css';
import { Car } from '../car/car';
import { Field } from '../models/field/field';
import { InputField } from '../models/input-field/input-field';
import { Track } from '../track/track';
import { Query } from '../models/query-interface';
import { API } from '../API/API';
import { setting } from '../setting';
import { getRandomColor } from '../../../shared/random-color';
import { CreateCarInterface } from '../models/car-interface';
import { Popup } from '../popup/popup';

export class Garage extends Field {
  private readonly createInput: InputField;

  private readonly updateInput: InputField;

  private resetBtn?: HTMLButtonElement;

  private generateBtn?: HTMLButtonElement;

  private carContainer: HTMLElement;

  raceBtn?: HTMLButtonElement;

  tracks: Track[] = [];

  private garageCounter?: number;

  private pageCounter?: number;

  private activeCar?: Car;

  constructor() {
    super(['garage']);

    const inputsContainer = document.createElement('div');
    inputsContainer.classList.add('inputs-container');
    this.contantsField.element.appendChild(inputsContainer);

    this.createInput = new InputField('create');
    inputsContainer.appendChild(this.createInput.element);
    this.createInput.confirmButton.addEventListener('click', () => {
      this.createCar();
    });

    this.updateInput = new InputField('update', 'disable');
    inputsContainer.appendChild(this.updateInput.element);

    this.createButtonsField(inputsContainer);

    this.carContainer = document.createElement('div');
    this.contantsField.element.appendChild(this.carContainer);

    this.getCars([{ key: '_page', value: '1' }, { key: '_limit', value: '7' }]); // Пока так
  }

  private createButtonsField(rootElement: HTMLElement) {
    const contaner = document.createElement('div');
    contaner.classList.add('btns-container');
    rootElement.appendChild(contaner);

    this.raceBtn = document.createElement('button');
    this.raceBtn.innerHTML = 'race';
    this.raceBtn.classList.add('control-btn', 'race-btn');
    this.raceBtn.addEventListener('click', () => {
      this.race();
    });
    contaner.appendChild(this.raceBtn);

    this.resetBtn = document.createElement('button');
    this.resetBtn.innerHTML = 'reset';
    this.resetBtn.classList.add('control-btn', 'reset-btn', setting.offClasses.garageOffClass);
    contaner.appendChild(this.resetBtn);
    this.resetBtn.addEventListener('click', () => {
      this.resetRace();
    });

    this.generateBtn = document.createElement('button');
    this.generateBtn.innerHTML = 'generate cars';
    this.generateBtn.classList.add('control-btn', 'generate-btn');
    this.generateBtn.addEventListener('click', () => {
      this.addGenerateListner();
    });
    contaner.appendChild(this.generateBtn);
  }

  private async getCars(query: Query[]) {
    this.carContainer.innerHTML = '';
    const responseObj = await API.getCars(query);
    this.garageCounter = responseObj.totalCount;
    console.log(this.garageCounter);
    responseObj.cars.forEach((carProto) => {
      const track = new Track(new Car(carProto));
      this.addTrackListner(track);
      this.tracks.push(track);
      this.carContainer.appendChild(track.element);
    });
  }

  private addTrackListner(track: Track) {
    track.removeButton?.addEventListener('click', () => {
      this.deleteCar(track);
    });

    track.selectButton?.addEventListener('click', () => {
      this.selectCar(track);
    }, { once: true });
  }

  private async deleteCar(track: Track) {
    await track.deleteCar();
    this.getCars([{ key: '_page', value: '1' }, { key: '_limit', value: '7' }]); // Потом все такие переделать
  }

  private selectCar(track: Track) {
    this.activeCar = track.getCar();
    this.updateInput.element.classList.remove('disable');
    this.updateInput.color.value = this.activeCar.color;
    this.updateInput.name.value = this.activeCar.name;
    this.updateInput.confirmButton.addEventListener('click', async () => {
      await this.confirmUpdateCar();
      this.resetUpdateField();
      this.getCars([{ key: '_page', value: '1' }, { key: '_limit', value: '7' }]); // Потом все такие переделать
    }, { once: true });
  }

  private confirmUpdateCar(): Promise<void> {
    if (!this.activeCar) {
      throw Error('Active car does not selected!');
    } else {
      return API.updateCar(this.activeCar.id, {
        name: this.updateInput.name.value,
        color: this.updateInput.color.value,
      });
    }
  }

  private resetUpdateField() {
    this.updateInput.element.classList.add('disable');
    this.updateInput.name.value = '';
    this.updateInput.color.value = '';
    this.activeCar = undefined;
  }

  private async createCar() {
    const car = {
      name: this.createInput.name.value,
      color: this.createInput.color.value,
    };
    await API.createCar(car);
    this.resetCreateField();
    this.getCars([{ key: '_page', value: '1' }, { key: '_limit', value: '7' }]);
  }

  private resetCreateField() {
    this.createInput.name.value = '';
    this.createInput.color.value = '';
  }

  private async addGenerateListner() {
    const cars: CreateCarInterface[] = [];
    await new Promise<void>((resolve) => {
      for (let i = 0; i < 100; i++) {
        cars.push(Garage.getRandomCar());
      }
      resolve();
    });
    await Garage.generateCars(cars);
    this.getCars([{ key: '_page', value: '1' }, { key: '_limit', value: '7' }]);
  }

  private static async generateCars(cars: CreateCarInterface[]): Promise<void> {
    return new Promise(async (resolve) => {
      const promises = cars.map((car) => API.createCar(car));
      await Promise.all(promises);
      resolve();
    });
  }

  private static getRandomCar(): CreateCarInterface {
    const indexCarName = Math.round(Math.random() * (setting.carNames.length - 1)); // Рандомная марка машины (индекс)
    const { name } = setting.carNames[indexCarName];
    const indexCarModel = Math.round(Math.random() * (setting.carNames[indexCarName].model.length - 1));
    const model = setting.carNames[indexCarName].model[indexCarModel].modelName;
    const color = getRandomColor();
    return { name: `${name} ${model}`, color };
  }

  private async race() {
    this.toggleRaceBtn();
    const stopPromises: Promise<void>[] = [];
    this.tracks.forEach((track) => {
      stopPromises.push(track.carStop());
    });
    await Promise.all(stopPromises);

    const promises: Promise<Track>[] = [];
    this.tracks.forEach((track) => {
      promises.push(track.carRaceStart());
    });
    const bestTrack = await Promise.race(promises);
    this.createWinPopup(bestTrack);
  }

  private resetRace() {
    this.resetBtn?.classList.add(setting.offClasses.garageOffClass);
    const promises: Promise<void>[] = [];
    this.tracks.forEach((track) => {
      promises.push(track.carStop());
    });
    Promise.all(promises).then(() => {
      this.raceBtn?.classList.remove(setting.offClasses.garageOffClass);
    });
  }

  private toggleRaceBtn() {
    this.raceBtn?.classList.toggle(setting.offClasses.garageOffClass);
    this.resetBtn?.classList.toggle(setting.offClasses.garageOffClass);
  }

  private createWinPopup(track: Track) {
    const winPopup = new Popup();
    const time = parseFloat(track.getCarElement().style.animationDuration);
    const clearTime = time.toFixed(2);
    winPopup.popUp.element.innerHTML = `
    ${track.getCar().name} won in ${clearTime} seconds
    `;
    this.element.appendChild(winPopup.element);
    winPopup.showPopup();
    winPopup.element.addEventListener('click', async () => {
      await winPopup.closePopup();
      winPopup.element.remove();
    });
  }
}
