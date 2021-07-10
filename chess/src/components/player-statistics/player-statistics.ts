import { BaseComponents } from "../models/base-component";
import { MoveTable } from "../move-table/move-table";
import { Player } from "../player/player";
import { setting } from "../settings/setting";

export class PlayerStatistics extends BaseComponents {
  private player: Player;

  private moveTable: MoveTable;

  constructor(name: string) {
    super('div', [setting.classNames.game.playerStatistics]);
    this.player = this.initPlayer(name);


  }

  private initPlayer(name: string) {
    return new Player(name, false);
  }
}