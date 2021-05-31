import { Field } from '../field-components';
import './about.css';

const gameExImg = './Rules/Game-ex.png';
const settingExImg = './Rules/Setting-ex.jpg';
const registerExImg = './Rules/Register-ex.svg';

export class About extends Field {
  constructor() {
    super('main-section', 'own-about');
    this.contantsField.element.innerHTML = `
      <h2 class="title">How to play?</h2>
      <div class="description">
        <div class="rules" id="first">
          <div class="number">1</div>
          <p class="description__text">Register new player in game</p>
        </div>
        <img id="register-img" src="${registerExImg}" alt="register example">
      </div>
      <div class="description">
        <div class="rules" id="second">
          <div class="number">2</div>
          <p class="description__text">Configure your game settings</p>
        </div>
        <img id="setting-img" src="${settingExImg}" alt="setting example">
      </div>
      <div class="description">
        <div class="rules" id="third">
          <div class="number">3</div>
          <p class="description__text">Start you new game! Remember card positions and match it before times up.</p>
        </div>
        <img id="game-img" src="${gameExImg}" alt="game example">
      </div>`;
  }
}
