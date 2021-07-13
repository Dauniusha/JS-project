import { BaseComponents } from "../models/base-component";
import { PlayerWithMove } from "../models/data-base/data-base-player-move";
import { MoveTable } from "../move-table/move-table";
import { Player } from "../player/player";
import { setting } from "../settings/setting";
import './player-statistics.css';

export class PlayerStatistics extends BaseComponents {
  private player: Player;

  moveTable: MoveTable;

  constructor(private color: string, counter: number) {
    super('div', [setting.classNames.game.playerStatistics]);

    this.player = new Player(false, counter);
    this.element.appendChild(this.player.element);

    this.moveTable = new MoveTable();
    this.element.appendChild(this.moveTable.element);
  }

  getColor(): string {
    return this.color;
  }

  getName(): string {
    return this.player.getName();
  }

  getPlayer(): Player {
    return this.player;
  }

  getPlayerWithMoves(): PlayerWithMove {
    return { player: this.player.getNameWithAvatar(), moves: this.moveTable.getAllMoves() };
  }
}