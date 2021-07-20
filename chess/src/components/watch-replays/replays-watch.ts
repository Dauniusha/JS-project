import { Game } from "../game/game";
import { ReplaysDBObject } from "../models/data-base/data-base-replays-object";
import { color } from "../models/game/color-interface";
import { PlayerStatistics } from "../player-statistics/player-statistics";

export class WatchReplay extends Game {
  private whitePlayer: PlayerStatistics;

  private whiteIncrement = 0;

  private blackPlayer: PlayerStatistics;

  private blackIncrement = 0;

  constructor(replay: ReplaysDBObject) {
    super(replay);

    const players = this.getPlayerStatistics();
    [ this.whitePlayer, this.blackPlayer ] = players.firstPlayer.getColor() === color.white ?
    [ players.firstPlayer, players.secondPlayer ] : [ players.secondPlayer, players.firstPlayer ];

  }
  
  makeMove(isNext: boolean) {
    let startCell: string, endCell: string;

    if (isNext) {
      if (this.isWhiteMove) {
        startCell = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement].startCell;
        endCell = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement].endCell;
        this.whiteIncrement++;
      } else {
        startCell = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement].startCell;
        endCell = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement].endCell;
        this.blackIncrement++;
      }
    } else {
      if (!this.isWhiteMove) {
        this.whiteIncrement--;
        endCell = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement].startCell;
        startCell = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement].endCell;
      } else {
        this.blackIncrement--;
        endCell = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement].startCell;
        startCell = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement].endCell;
      }
    }

    this.pieceActive = this.chessBoard.selectPiece(startCell);
    this.replayPieceMove(endCell);
  }

  private replayPieceMove(cellId: string) { // TODO: Не понимаю, почему не работает переопределение методов
    if (this.pieceActive) {
      this.checkBacklightRemove();
      this.moveBacklightRemove();

      this.moveBacklightAdd(cellId);
      this.chessBoard.pieceMove(cellId, this.pieceActive);
      this.isWhiteMove = !this.isWhiteMove;

      this.replayCheckMateValidation(this.pieceActive.color);
      this.pieceActive = undefined;
    }
  }

  private replayCheckMateValidation(movedPieceColor: string) {
    const isCheck = this.chessBoard.checkValidation(movedPieceColor);
    const defendersCanMove = this.chessBoard.movePossibilityValidation(movedPieceColor);

    if (isCheck && !defendersCanMove) {
      this.checkBacklightAdd();
      if (this.activePlayer) {
        this.createWinPopup(this.activePlayer?.getName());
      } else {
        throw new Error('Active player does not exist!');
      }
    } else if (isCheck) {
      this.checkBacklightAdd();
      console.log('check');
    } else if (!defendersCanMove) {
      this.createDrawPopup();
    }
  }
}