import { BaseComponents } from '../models/base-component';
import { setting } from '../settings/setting';
import './header.css';

export class Header extends BaseComponents {
  private readonly container: HTMLElement;

  constructor() {
    super('header', [setting.classNames.headers.header]);
    
    this.container = document.createElement('div');
    this.container.classList.add(setting.classNames.headers.container);

    this.element.appendChild(this.container);

    const logoElement = document.createElement('div');
    logoElement.classList.add(setting.classNames.headers.logo);
    logoElement.innerHTML = `
      <img class="${setting.classNames.headers.logoImg}" src="./public/logo/logo.svg">
      <span class="${setting.classNames.headers.logoText}">Chess</span>
    `;
  }

}