import { Route } from './route-interface';

const START_PAGE = '#/About';

export class Router {
  routes: Route[] = [];

  add(route: Route) {
    this.routes.push(route);
  }

  addRoute(hash: string) {
    this.enumiration(hash);
  }

  changeRoute() {
    const location = window.location.hash;
    if (!location) {
      this.enumiration(START_PAGE);
    } else {
      this.enumiration(location);
    }
  }

  private enumiration(hash: string) {
    this.routes.forEach((route) => {
      if (route.hash === hash) {
        route.needFoo();
      }
    });
  }
}
