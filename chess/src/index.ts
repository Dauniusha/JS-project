import { App } from "./components/app";

const app = new App(document.body);
window.addEventListener('load', () => {
  app.router.changeRoute();
});

window.addEventListener('hashchange', () => {
  app.router.changeRoute();
});