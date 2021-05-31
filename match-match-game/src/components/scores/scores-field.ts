import './scores-field.css';
import { storage } from '../data-base/data-base-elem';
import { DBObject } from '../data-base/DB-object-interface';
import { Field } from '../field-components';
import { Score } from './score';

export class Scores extends Field {
  private readonly generalParent: HTMLElement;

  private players: DBObject[] = [];

  private playersResults: Score[] = [];

  constructor() {
    super('main-section', 'scores');
    this.contantsField.element.innerHTML = `
      <h2 class="title scores-title">Best players</h2>
    `;
    this.generalParent = document.createElement('div');
    this.generalParent.classList.add('scores-fields');
    this.contantsField.element.appendChild(this.generalParent);
    this.createResults();
  }

  private async createResults() {
    await this.getPlayers();
    this.createResultsElem(this.players);
  }

  private createResultsElem(players: DBObject[]) {
    players.forEach((player) => {
      this.playersResults.push(new Score(player));
    });
    this.playersResults.forEach((result) => {
      this.generalParent.appendChild(result.element);
    });
  }

  private getPlayers(): Promise<void> {
    return new Promise(async (resolve) => {
      let allPlayers = await storage.getPlayers().then((value) => value);
      if (!allPlayers) {
        allPlayers = [];
      }
      allPlayers.sort((a, b) => (a.score < b.score ? 1 : -1));
      for (let i = 0; i < 10 && allPlayers[i] && allPlayers[i].score !== undefined; i++) {
        this.players.push(allPlayers[i]);
      }
      resolve();
    });
  }
}
