import { Route } from '../models/route/route-interface';
import { setting } from '../settings/setting';

export class Router {
  private routes: Route[] = [];

  add(route: Route) {
    this.routes.push(route);
  }

  newRoute(hash: string) {
    this.enumiration(hash);
  }

  changeRoute() {
    const location = window.location.hash;
    if (!location) {
      this.enumiration(setting.startPage);
    } else {
      this.enumiration(location);
    }
  }

  private enumiration(hash: string) {
    for (let i = 0; i < this.routes.length; i++) {
      if (hash.indexOf(this.routes[i].hash) !== -1) {
        this.routes[i].needFoo();
        break;
      }
    }
  }
}
