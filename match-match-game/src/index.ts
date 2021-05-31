import './style.css';
import { App } from './app';

const app = new App(document.body);
window.addEventListener('load', () => {
  app.router.changeRoute();
});

window.addEventListener('hashchange', () => {
  app.router.changeRoute();
});
