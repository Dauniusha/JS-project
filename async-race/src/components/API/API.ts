import { CarDataInterface, CarInterface, CreateCarInterface } from '../models/car-interface';
import { Query } from '../models/query-interface';
import { Winner } from '../models/winner-interface';
import { APISettings } from './API-setting';

// [{ key: 'page', value: '1' }]

export class API {
  private static generateQueryString(queryParams: Query[] = []) {
    return queryParams.length ? `?${queryParams.map((x) => `${x.key}=${x.value}`).join('&')}`
      : '';
  }

  static getCars(queryParams: Query[] = []): Promise<{ cars: CarInterface[], totalCount: number }> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.garage}${API.generateQueryString(queryParams)}`);
      const cars = await response.json();
      const totalCount = Number(response.headers.get('X-Total-Count'));
      resolve({ cars, totalCount });
    });
  }

  /* static getTotalCount(queryParams: Query[] = []): Promise<number> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.garage}${API.generateQueryString(queryParams)}`);
      const totalCount = Number(response.headers.get('X-Total-Count'));
      resolve(totalCount);
    });
  } */

  static deleteCar(id: number): Promise<void> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.garage}/${id}`, {
        method: APISettings.methods.delete,
      });
      API.validation(response);
      resolve();
    });
  }

  static updateCar(id: number, car: { name: string, color: string }): Promise<void> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.garage}/${id}`, {
        method: APISettings.methods.put,
        headers: {
          'Content-Type': APISettings.headers.contentType,
        },
        body: JSON.stringify(car),
      });
      API.validation(response);
      resolve();
    });
  }

  private static validation(response: Response) {
    if (!response.ok) {
      console.log(`Error ${response.status}!`);
    }
  }

  static createCar(car: CreateCarInterface): Promise<void> {
    return new Promise(async (resolve) => {
      if (!car.name) {
        car.name = APISettings.standartCar.name;
      }
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.garage}`, {
        method: APISettings.methods.post,
        headers: {
          'Content-Type': APISettings.headers.contentType,
        },
        body: JSON.stringify(car),
      });
      API.validation(response);
      resolve();
    });
  }

  static toggleCarsEngine(queryParams: Query[]): Promise<CarDataInterface> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.engine}${API.generateQueryString(queryParams)}`);
      const carData = await response.json();
      resolve(carData);
    });
  }

  static switchToDriveMode(queryParams: Query[]): Promise<boolean> {
    return new Promise(async (resolve) => {
      const response = await fetch(`${APISettings.baseURL}${APISettings.path.engine}${API.generateQueryString(queryParams)}`);
      if (response.ok) {
        resolve(true);
      } else {
        switch (response.status) {
          case APISettings.serverErrorCode:
            resolve(false);
            break;
          default:
            console.log(`Error ${response.status}!`);
            resolve(false);
        }
      }
    });
  }
      resolve();
    });
  }
}

// export const api = new API();
