import { BaseComponents } from "../models/base-component";
import { PlayerWithMove } from "../models/data-base/data-base-player-move";
import { ReplaysDBObject } from "../models/data-base/data-base-replays-object";
import { MoveTable } from "../move-table/move-table";
import { Player } from "../player/player";
import { setting } from "../settings/setting";
import './player-statistics.css';

export class PlayerStatistics extends BaseComponents {
  private player: Player;

  moveTable: MoveTable;

  private color: string;

  constructor(casual?: { color: string, counter: number }, replays?: { player: PlayerWithMove, counter: number }) {
    super('div', [setting.classNames.game.playerStatistics]);

    if (casual) {
      this.color = casual.color;

      this.player = new Player({ writable: false, counter: casual.counter });

      this.moveTable = new MoveTable();
    } else if (replays) {
      this.color = replays.player.color;
      
      this.player = new Player(undefined,
        { avatarURL: replays.player.player.avatarURL, name: replays.player.player.name });

      this.moveTable = new MoveTable();
      this.moveTable.moveInit(replays.player.moves);
    } else {
      throw new Error('All parametr is invalid!');
    }

    this.element.appendChild(this.player.element);
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
    return { player: this.player.getNameWithAvatar(), moves: this.moveTable.getAllMoves(), color: this.color };
  }
}