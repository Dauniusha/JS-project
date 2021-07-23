import { timeFunctions } from '../../shared/translate-time';
import { Game } from '../game/game';
import { ClearMove } from '../models/clear-move';
import { PlayerDBObject } from '../models/data-base/data-base-player-object';
import { ReplaysDBObject } from '../models/data-base/data-base-replays-object';
import { color } from '../models/game/color-interface';
import { ReplayBtns } from '../models/replays/replays-btns';
import { Move } from '../move/move';
import { PlayerStatistics } from '../player-statistics/player-statistics';
import { setting } from '../settings/setting';
import { timer } from '../timer/timer';

export class WatchReplay extends Game {
  private whitePlayer: PlayerStatistics;

  private whiteIncrement = 0;

  private blackPlayer: PlayerStatistics;

  private blackIncrement = 0;

  private readonly winner: PlayerDBObject | null;

  private readonly moveAmount: number;

  private moveCounter: number = 0;

  private readonly prevBtn: HTMLElement;

  private readonly nextBtn: HTMLElement;

  private readonly stopBtn: HTMLElement;

  private readonly boostModeBtns: HTMLElement[];

  private isFirstGameEnd = true;

  private boostMode: number = 1;

  constructor(replay: ReplaysDBObject, btns: ReplayBtns) {
    super(replay);

    this.winner = replay.winner;

    this.prevBtn = btns.moveBtns.prevBtn;
    this.stopBtn = btns.moveBtns.stopBtn;
    this.nextBtn = btns.moveBtns.nextBtn;

    this.boostModeBtns = btns.boostBtns;

    this.initReplayBtnsListners();

    this.moveAmount = replay.moveAmount;

    const players = this.getPlayerStatistics();
    [this.whitePlayer, this.blackPlayer] = players.firstPlayer.getColor() === color.white
      ? [players.firstPlayer, players.secondPlayer] : [players.secondPlayer, players.firstPlayer];

    this.initTimer();
  }

  private initReplayBtnsListners() {
    this.prevBtn.addEventListener('click', () => {
      this.makeMove(false);
    });

    this.stopBtn.addEventListener('click', () => {
      this.stopTimer();
    });

    this.nextBtn.addEventListener('click', () => {
      this.makeMove(true);
    });

    this.boostModeBtns.forEach((btn) => {
      const boost = btn.id;
      btn.addEventListener('click', () => {
        this.boostMode = Number(boost);
        this.startNewBoostModeTimer();
      });
    });
  }

  makeMove(isNext: boolean) {
    let moveRecord: ClearMove;

    if (isNext) {
      this.confirmMoveSwitching(true);
      if (this.isWhiteMove) {
        this.removeMoveRecordBacklights(this.whitePlayer.moveTable.takeMove(this.whiteIncrement - 1));
        this.addMoveRecordBacklights(this.whitePlayer.moveTable.takeMove(this.whiteIncrement));
        moveRecord = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement];
        this.whiteIncrement++;
      } else {
        this.removeMoveRecordBacklights(this.blackPlayer.moveTable.takeMove(this.blackIncrement - 1));
        this.addMoveRecordBacklights(this.blackPlayer.moveTable.takeMove(this.blackIncrement));
        moveRecord = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement];
        this.blackIncrement++;
      }
    } else {
      if (!this.isWhiteMove) {
        this.whiteIncrement--;
        this.removeMoveRecordBacklights(this.whitePlayer.moveTable.takeMove(this.whiteIncrement + 1));
        this.addMoveRecordBacklights(this.whitePlayer.moveTable.takeMove(this.whiteIncrement));
        moveRecord = this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement];
      } else {
        this.blackIncrement--;
        this.removeMoveRecordBacklights(this.blackPlayer.moveTable.takeMove(this.blackIncrement + 1));
        this.addMoveRecordBacklights(this.blackPlayer.moveTable.takeMove(this.blackIncrement));
        moveRecord = this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement];
      }
      this.confirmMoveSwitching(false);
    }

    this.updateTimer(moveRecord.time);
    this.pieceActive = this.chessBoard.selectPiece(moveRecord.startCell);
    this.replayPieceMove(moveRecord.endCell);
  }

  private addMoveRecordBacklights(moveRecord?: Move) {
    moveRecord?.element.classList.add(setting.classNames.replays.activeMove);
  }

  private removeMoveRecordBacklights(moveRecord?: Move) {
    moveRecord?.element.classList.remove(setting.classNames.replays.activeMove);
  }

  private replayPieceMove(cellId: string) { // TODO: Не знаю, как сделать без копирования
    if (this.pieceActive) {
      this.checkBacklightRemove();
      this.moveBacklightRemove();

      this.moveBacklightAdd(cellId);
      this.chessBoard.pieceMove(cellId, this.pieceActive);


      this.chessBoard.removeCloseMove();
      this.replayCheckMateValidation(this.pieceActive.color);

      this.pieceActive = undefined;
      this.isWhiteMove = !this.isWhiteMove;
      this.addMoveHolder();
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

  private updateTimer(time: string) {
    const timeNow = timeFunctions.getNumberTime(time);

    timer.stopTimer();
    this.startReplayTimer(timeNow);
  }

  private confirmMoveSwitching(isNext: boolean) {
    if (isNext) {
      this.moveCounter++;
      if (this.moveCounter === this.moveAmount) {
        this.disableBlockBtn(true);
        if (this.isFirstGameEnd) {
          this.gameEnd();
        } else {
          timer.stopTimer();
        }
      }
      this.enableBlockBtn(false);
    } else {
      this.moveCounter--;
      if(!this.moveCounter) {
        this.disableBlockBtn(false);
      }
      this.enableBlockBtn(true);
    }
  }

  private disableBlockBtn(isNextBtn: boolean) {
    if (isNextBtn) {
      this.stopBtn.classList.add(setting.classNames.disable);
      this.nextBtn.classList.add(setting.classNames.disable);
    } else {
      this.prevBtn.classList.add(setting.classNames.disable);
    }
  }

  private enableBlockBtn(isNextBtn: boolean) {
    if (isNextBtn) {
      this.stopBtn.classList.remove(setting.classNames.disable);
      this.nextBtn.classList.remove(setting.classNames.disable);
    } else {
      this.prevBtn.classList.remove(setting.classNames.disable);
    }
  }

  private gameEnd() {
    if (!this.winner) {
      this.createDrawPopup();
    } else {
      this.createWinPopup(this.winner.name);
    }
    this.stopTimer();
  }

  private initTimer() {
    this.startReplayTimer(0);
  }

  private startReplayTimer(time?: number) {
    if (time) {
      timer.setTimeNow(time);
      timer.showTime(Math.floor(time / 60), time % 60);
    }

    const replayTimer = setInterval(() => {
      timer.incrementTimeNow();
      const timeNow = timer.getTimeNow();
      this.compareMoves(timeNow);
      timer.showTime(Math.floor(timeNow / 60), timeNow % 60);
    }, 1000 / this.boostMode);

    timer.setTimer(replayTimer);
  }

  private compareMoves(time: number) {
    const stringTime = timeFunctions.getStringTime(time);
  
    if (
      this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement].time === stringTime
      || this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement].time === stringTime
      ) {
      this.makeMove(true);
    }
  }

  private stopTimer() {
    timer.stopTimer();
  }

  private startNewBoostModeTimer() {
    timer.stopTimer();
    this.startReplayTimer();
  }
}
