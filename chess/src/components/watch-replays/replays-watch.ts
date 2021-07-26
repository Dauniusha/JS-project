import { colorFunctions } from '../../shared/color';
import { timeFunctions } from '../../shared/translate-time';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Game } from '../game/game';
import { PlayerDBObject } from '../models/data-base/data-base-player-object';
import { ReplaysDBObject } from '../models/data-base/data-base-replays-object';
import { color } from '../models/game/color-interface';
import { ReplayBtns } from '../models/replays/replays-btns';
import { MoveTable } from '../move-table/move-table';
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
    this.boostModeBtns[0].classList.add(setting.classNames.enable);

    this.initReplayBtnsListners();

    this.moveAmount = replay.moveAmount;

    const players = this.getPlayerStatistics();
    [this.whitePlayer, this.blackPlayer] = players.firstPlayer.getColor() === color.white
      ? [players.firstPlayer, players.secondPlayer] : [players.secondPlayer, players.firstPlayer];

    this.initTimer();
  }

  private initReplayBtnsListners() {
    this.prevBtn.addEventListener('click', () => {
      this.removePauseState();
      this.makeMove(false);
    });

    this.stopBtn.addEventListener('click', () => {
      if (this.stopBtn.classList.contains(setting.classNames.headers.replaysPlay)) {
        this.removePauseState();
        this.startReplayTimer();
      } else {
        this.stopBtn.classList.add(setting.classNames.headers.replaysPlay);
        this.stopBtn.style.backgroundImage = `url(${setting.imgNames.play})`;
        this.stopTimer();
      }
    });

    this.nextBtn.addEventListener('click', () => {
      this.removePauseState();
      this.makeMove(true);
    });

    this.boostModeBtns.forEach((btn) => {
      const boost = btn.id;
      btn.addEventListener('click', () => {
        this.boostModeBtns.forEach((btn) => {
          btn.classList.remove(setting.classNames.enable);
        });
        btn.classList.add(setting.classNames.enable);
        this.boostMode = Number(boost);
        if (!this.stopBtn.classList.contains(setting.classNames.headers.replaysPlay)) {
          this.startNewBoostModeTimer();
        }
      });
    });
  }

  private removePauseState() {
    this.stopBtn.classList.remove(setting.classNames.headers.replaysPlay);
    this.stopBtn.style.backgroundImage = `url(${setting.imgNames.pause})`;
  }

  makeMove(isNext: boolean) {
    let moveRecord: Move;

    if (isNext) {
      if (this.isWhiteMove) {
        this.removeMoveRecordBacklights(this.whitePlayer.moveTable, this.whiteIncrement - 1);
        this.addMoveRecordBacklights(this.whitePlayer.moveTable, this.whiteIncrement);
        moveRecord = this.whitePlayer.moveTable.takeMove(this.whiteIncrement);
        this.whiteIncrement++;
      } else {
        this.removeMoveRecordBacklights(this.blackPlayer.moveTable, this.blackIncrement - 1);
        this.addMoveRecordBacklights(this.blackPlayer.moveTable, this.blackIncrement);
        moveRecord = this.blackPlayer.moveTable.takeMove(this.blackIncrement);
        this.blackIncrement++;
      }
      if (this.confirmMoveSwitching(true, moveRecord)) {
        return;
      }
    } else {
      if (!this.isWhiteMove) {
        this.whiteIncrement--;
        this.removeMoveRecordBacklights(this.whitePlayer.moveTable, this.whiteIncrement + 1);
        this.addMoveRecordBacklights(this.whitePlayer.moveTable, this.whiteIncrement);
        moveRecord = this.whitePlayer.moveTable.takeMove(this.whiteIncrement);
      } else {
        this.blackIncrement--;
        this.removeMoveRecordBacklights(this.blackPlayer.moveTable, this.blackIncrement + 1);
        this.addMoveRecordBacklights(this.blackPlayer.moveTable, this.blackIncrement);
        moveRecord = this.blackPlayer.moveTable.takeMove(this.blackIncrement);
      }
      if (this.confirmMoveSwitching(false, moveRecord)) {
        return;
      };
    }
  }

  private makeReplayPieceMove(moveRecord: Move, isReverseMove: boolean) {
    const clearMove = moveRecord.getClearMove();

    let endCell = clearMove.endCell;
    let startCell = clearMove.startCell;

    if (isReverseMove) {
      [ endCell, startCell ] = [ startCell, endCell ];

      this.pieceActive = this.chessBoard.selectPiece(startCell);
      this.replayPieceMove(endCell, isReverseMove);
    } else {
      moveRecord.setSetup(JSON.parse(JSON.stringify(setting.gameSetup)));

      this.pieceActive = this.chessBoard.selectPiece(startCell);
      this.replayPieceMove(endCell, isReverseMove);

      const newPiece = moveRecord.getClearMove().newPiece;
      if (newPiece && this.pieceActive instanceof Pawn) {
        this.replaceTransormPiece(this.pieceActive, newPiece);
      }
    }

    this.removeReplayCancelMoveAndCheckValidation(this.pieceActive.color, isReverseMove);
  }

  private addMoveRecordBacklights(moveTable: MoveTable, increment: number) {
    if (increment > -1 && increment < moveTable.getAllMoves().length) {
      moveTable.takeMove(increment).element.classList.add(setting.classNames.replays.activeMove);
    }
  }

  private removeMoveRecordBacklights(moveTable: MoveTable, increment: number) {
    if (increment > -1 && increment < moveTable.getAllMoves().length) {
      moveTable.takeMove(increment).element.classList.remove(setting.classNames.replays.activeMove);
    }
  }

  private replayPieceMove(cellId: string, isReverseMove: boolean) { // TODO: Не знаю, как сделать без копирования
    if (this.pieceActive) {
      this.checkBacklightRemove();
      this.moveBacklightRemove();

      if (!isReverseMove) {
        this.moveBacklightAdd(cellId); 
      }
      this.chessBoard.pieceMove(cellId, this.pieceActive);
    }
  }

  private removeReplayCancelMoveAndCheckValidation(color: string, isReverseMove: boolean) {
    this.chessBoard.removeCloseMove();
    this.replayCheckMateValidation(color, isReverseMove);

    this.pieceActive = undefined;
    this.isWhiteMove = !this.isWhiteMove;
    this.addMoveHolder();
  }

  private replayCheckMateValidation(movedPieceColor: string, isReverseMove: boolean) {
    console.log(setting.gameSetup);
    const needColor = isReverseMove ? colorFunctions.getReverseColor(movedPieceColor) : movedPieceColor;

    const isCheck = this.chessBoard.checkValidation(needColor);
    const defendersCanMove = this.chessBoard.movePossibilityValidation(needColor);

    if (isCheck && !defendersCanMove) {
      this.checkBacklightAdd();
      if (this.activePlayer) {
        this.createWinPopup(this.activePlayer?.getName());
      } else {
        throw new Error('Active player does not exist!');
      }
    } else if (isCheck) {
      this.checkBacklightAdd(needColor);
      console.log('check');
    } else if (!defendersCanMove) {
      this.createDrawPopup();
    }

    if (this.chessBoard.pieces.length === 2) {
      this.gameEnd();
      this.isEndGame = true;
    }
  }

  private updateTimer(time: string) {
    const timeNow = timeFunctions.getNumberTime(time);

    timer.stopTimer();
    this.startReplayTimer(timeNow);
  }

  private confirmMoveSwitching(isNext: boolean, moveRecord: Move): boolean {
    if (isNext) {
      this.moveCounter++;

      this.makeReplayPieceMove(moveRecord, !isNext);
      this.updateTimer(moveRecord.getClearMove().time);

      if (this.moveCounter === this.moveAmount) {
        this.disableBlockBtn(true);
        if (this.isFirstGameEnd) {
          this.gameEnd();
          this.isFirstGameEnd = false;
        }
        timer.stopTimer();
        return true;
      }
      this.enableBlockBtn(false);
    } else {
      this.moveCounter--;
      if(!this.moveCounter) {
        this.disableBlockBtn(false);
      }
      this.enableBlockBtn(true);
      this.previousMove(moveRecord);
    }
    return false;
  }

  private previousMove(moveRecord: Move) {
    const previousMoveRecord = this.getPreviousMoveRecord(moveRecord);

    const [ player, count ] = moveRecord.getClearMove().fullName.indexOf(color.white) === -1 ?
    [ this.blackPlayer, this.blackIncrement - 1 ] : [ this.whitePlayer, this.whiteIncrement - 1 ];

    if (!previousMoveRecord) {
      this.makePreviousMove();
      this.removeMoveRecordBacklights(player.moveTable, count + 1);
      this.updateTimer('00:00');
      this.isWhiteMove = !this.isWhiteMove;
      this.addMoveHolder();
    } else {
      setting.gameSetup = JSON.parse(JSON.stringify(previousMoveRecord.getSetup()));
      this.makePreviousMove(previousMoveRecord);

      this.removeMoveRecordBacklights(player.moveTable, count + 1);
      this.addMoveRecordBacklights(player.moveTable, count);

      this.makeReplayPieceMove(previousMoveRecord, false);
      this.updateTimer(previousMoveRecord.getClearMove().time);
    }
  }

  private makePreviousMove(moveRecord?: Move) {
    this.checkBacklightRemove();
    this.moveBacklightRemove();

    let movedPieceColor: string;
    if (moveRecord) {
      movedPieceColor = moveRecord.getClearMove().fullName.indexOf(color.white) === -1 ? color.black : color.white;
      setting.gameSetup = JSON.parse(JSON.stringify(moveRecord.getSetup()));
    } else {
      movedPieceColor = color.black;
      setting.gameSetup = JSON.parse(JSON.stringify(setting.initialGameSetup));
    }

    this.chessBoard.renderNewChessBoard(setting.gameSetup);

    this.chessBoard.removeCloseMove();
    this.replayCheckMateValidation(movedPieceColor, true);
  }

  private getPreviousMoveRecord(moveRecord: Move): Move | null {
    const [ player, count ] = moveRecord.getClearMove().fullName.indexOf(color.white) === -1 ?
    [ this.whitePlayer, this.whiteIncrement - 1 ] : [ this.blackPlayer, this.blackIncrement - 1 ];

    if (count > -1 && count < player.moveTable.getAllMoves().length) {
      return player.moveTable.takeMove(count);
    } else {
      return null;
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
  }

  private initTimer() {
    this.startReplayTimer(0);
  }

  private startReplayTimer(time?: number) {
    if (time !== undefined) {
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
      this.whitePlayer.moveTable.getAllMoves()[this.whiteIncrement]?.time === stringTime
      || this.blackPlayer.moveTable.getAllMoves()[this.blackIncrement]?.time === stringTime
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
