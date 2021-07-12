import { BaseComponents } from "../models/base-component";
import { MoveTable } from "../move-table/move-table";
import { Player } from "../player/player";
import { setting } from "../settings/setting";
import './player-statistics.css';

export class PlayerStatistics extends BaseComponents {
  private player: Player;

  moveTable: MoveTable;

  constructor(name: string, private color: string) {
    super('div', [setting.classNames.game.playerStatistics]);
    this.player = this.initPlayer(name);

    this.moveTable = new MoveTable();
    this.element.appendChild(this.moveTable.element);
  }

  private initPlayer(name: string) {
    const player = new Player(name, false);
    this.element.appendChild(player.element);
    return player;
  }

  getColor(): string {
    return this.color;
  }

  getName() {
    return this.player.getName();
  }
}