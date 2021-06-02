import './score.css';
import { BaseComponents } from '../models/base-conponents';
import { DBObject } from '../models/DB-object-interface';

export class Score extends BaseComponents {
  constructor(player: DBObject) {
    super('div', ['each-score']);
    this.element.innerHTML = `
      <div class="user-info">
        <img class="score-img" src="${player.avatarURL}" alt="ava">
        <div class="user-data">
          <p class="user-name">${player.firstName} ${player.lastName}</p>
          <p class="user-mail">${player.mail}</p>
        </div>
      </div>
      <p class="user-score">Score: <span class="user-score__inner">${player.score}</span></p>
    `;
  }
}
