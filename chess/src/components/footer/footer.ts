import { BaseComponents } from '../models/base-component';
import './footer.css';

export class Footer extends BaseComponents {
  constructor() {
    super('footer', ['footer']);

    this.element.innerHTML = `
    <div class="footer__container">
      <a class="footer__link" href="https://github.com/Dauniusha">GitHub</a>
      <span class="footer__text">RS School 2021</span>
    </div>
    `;
  }
}
