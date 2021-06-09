import { CarInterface } from '../models/car-interface';
import { setting } from '../setting';

export class Car {
  svg?: string;

  name: string;

  color: string;

  id: number;

  constructor(car: CarInterface) {
    this.name = car.name;
    this.color = car.color;
    this.id = car.id;
    this.initCarIcon();
  }

  private initCarIcon() {
    const [name, ...models] = this.name.split(' ');
    const model = models.join(' ');
    setting.carNames.forEach((carName) => {
      if (carName.name === name) {
        carName.model.forEach((carModel) => {
          if (carModel.modelName === model) {
            switch (carModel.type) {
              case 'coupe':
                this.svg = setting.carTypes.coupe;
                break;
              case 'pickup':
                this.svg = setting.carTypes.pickup;
                break;
              case 'hypercar':
                this.svg = setting.carTypes.hypercar;
                break;
              case 'sedan':
                this.svg = setting.carTypes.sedan;
                break;
              case 'sportcar':
                this.svg = setting.carTypes.sportcar;
                break;
              default:
                console.log('Something wrong!');
                break;
            }
          }
        });
      }
    });
    if (!this.svg) {
      this.svg = setting.carTypes.sedan;
    }
  }
}
