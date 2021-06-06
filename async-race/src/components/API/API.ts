import { Car } from "../car/car";
import { Query } from "../models/query-interface";
import { BASE_URL, PATH } from "./API-setting";

// [{ key: 'page', value: '1' }]

class API {
  private generateQueryString(queryParams: Query[] = []) {
    queryParams.length ? `?${queryParams.map( x => `${x.key}=${x.value}`).join('&')}`
    : '';
  }

  getCars(queryParams: Query[] = []): Promise<Car[]> {
    return new Promise (async (resolve) => {
      const response = await fetch(`${BASE_URL}${PATH.garage}${this.generateQueryString(queryParams)}`);
      const cars = await response.json();
      resolve(cars);
    });
  }
}

export const api = new API();
