import { cellNameToCellPosition } from '../../shared/cell-name-to-cell-position';
import { colorFunctions } from '../../shared/color';
import { createElement } from '../../shared/create-element';
import { timeFunctions } from '../../shared/translate-time';
import { ChessBoard } from '../chess-board/chess-board';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { storage } from '../data-base/data-base-element';
import { BaseComponents } from '../models/base-component';
import { PlayerWithMove } from '../models/data-base/data-base-player-move';
import { PlayerDBObject } from '../models/data-base/data-base-player-object';
import { ReplaysDBObject } from '../models/data-base/data-base-replays-object';
import { color } from '../models/game/color-interface';
import { PlayerStatistics } from '../player-statistics/player-statistics';
import { Popup } from '../popup/popup';
import { setting } from '../settings/setting';
import { timer } from '../timer/timer';
import './game.css';

export class Game extends BaseComponents {
  protected readonly chessBoard: ChessBoard;

  private possibleCells: HTMLElement[] = [];

  protected pieceActive?: Queen | King | Knight | Bishop | Pawn | Rook;

  protected isWhiteMove = true;

  private checkPieces?: (Queen | King | Knight | Bishop | Pawn | Rook)[];

  protected firstPlayer?: PlayerStatistics;

  protected secondPlayer?: PlayerStatistics;

  protected activePlayer?: PlayerStatistics;

  isEndGame = false;

  protected isDragAndDrop = false;

  protected isSecondClick = false;

  protected dragObj?: { object: HTMLImageElement, shiftX: number, shiftY: number, currentDroppable: HTMLElement | null };

  constructor(replay?: ReplaysDBObject, color?: string) {
    super('section', ['game']);

    if (replay) {
      [this.firstPlayer, this.secondPlayer] = this.replayPlayerInit(replay.firstPlayer, replay.secondPlayer);
      setTimeout(() => { // TODO: Не понимаю, почему он перед async функциями выполняется
        this.addMoveHolder();
      }, 200);

      this.chessBoard = new ChessBoard(setting.initialGameSetup);
      this.element.insertBefore(this.chessBoard.element, this.secondPlayer.element);
    } else {
      [this.firstPlayer, this.secondPlayer] = this.playerInit(color);
      setTimeout(() => { // TODO: Не понимаю, почему он перед async функциями выполняется
        this.addMoveHolder();
      }, 200);

      this.chessBoard = new ChessBoard(setting.initialGameSetup);
      this.element.insertBefore(this.chessBoard.element, this.secondPlayer.element);
    }
  }

  private playerInit(color?: string): PlayerStatistics[] {
    if (!color) {
      color = colorFunctions.getRandomColor();
    }

    const firstPlayer = new PlayerStatistics({ color, counter: 0 });
    this.element.appendChild(firstPlayer.element);

    const otherColor = colorFunctions.getReverseColor(color);
    const secondPlayer = new PlayerStatistics({ color: otherColor, counter: 1 });
    this.element.appendChild(secondPlayer.element);

    return [firstPlayer, secondPlayer];
  }

  private replayPlayerInit(firstPlayer: PlayerWithMove, secondPlayer: PlayerWithMove): PlayerStatistics[] {
    const firstPlayerStatistics = new PlayerStatistics(undefined, { player: firstPlayer, counter: 0 });
    this.element.appendChild(firstPlayerStatistics.element);

    const secondPlayerStatistics = new PlayerStatistics(undefined, { player: secondPlayer, counter: 1 });
    this.element.appendChild(secondPlayerStatistics.element);

    return [firstPlayerStatistics, secondPlayerStatistics];
  }

  getChessBoard(): ChessBoard {
    return this.chessBoard;
  }

  /* chessBoardListnersInit() {
    this.chessBoard.element.addEventListener('click', (elem) => {
      const pieceElem = (<Element>elem.target)?.closest('.' + setting.classNames.piece);
      const activeColor = this.isWhiteMove ? color.white : color.black;

      if (
      (<Element>elem.target)?.closest('.' + setting.classNames.possibleClearCell)
      || (<Element>elem.target)?.closest('.' + setting.classNames.possibleEngagedCell)
      ) {
        const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
        if (cell) {
          this.completeMove(cell.id);
        }
      } else if (pieceElem && pieceElem.getAttribute(setting.classNames.dataPiece)?.indexOf(activeColor) !== -1) {
          const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
          if (cell && !(this.pieceActive?.cell === cell.id)) {
            this.selectPiece(cell.id);
          } else {
            this.possibleCellsBacklightRemove();
            this.pieceActive = undefined;
          }
      } else {
        this.possibleCellsBacklightRemove();
      }
    });
  } */

  dragAndDropListners() {
    this.chessBoard.element.addEventListener('mousedown', (elem) => {
      this.isDragAndDrop = false;

      const pieceElem = <HTMLImageElement> (<Element>elem.target)?.closest(`.${setting.classNames.piece}`);
      if (pieceElem) {
        pieceElem.ondragstart = () => false;
      }

      const cell = (<Element>elem.target)?.closest(`.${setting.classNames.cell}`);

      this.onMouseDown(pieceElem, cell, elem);
    });
  }

  private onMouseDown(pieceElem: HTMLImageElement, cell: Element | null, elem: MouseEvent) {
    const activeColor = this.isWhiteMove ? color.white : color.black;

    if (
      cell
      && ((<Element>elem.target)?.closest(`.${setting.classNames.possibleClearCell}`)
      || (<Element>elem.target)?.closest(`.${setting.classNames.possibleEngagedCell}`))
    ) {
      this.completeMove(cell.id);
      document.onmousemove = null;
      this.isSecondClick = false;
      return;
    }
    if (pieceElem && pieceElem.getAttribute(setting.classNames.dataPiece)?.indexOf(activeColor) !== -1) {
      if (cell && !(this.pieceActive?.cell === cell.id)) {
        this.selectPiece(cell.id);
      } else if (cell && (this.pieceActive?.cell === cell.id)) {
        this.isSecondClick = true;
      }

      this.takeDragObj(pieceElem, elem);

      pieceElem.onmouseup = (event) => {
        this.clickOrDragDelegating(pieceElem, event, cell);
      };

      document.onmousemove = (event) => {
        this.onMouseMove(event);
      };
    } else {
      this.possibleCellsBacklightRemove();
      this.pieceActive = undefined;
      this.isSecondClick = false;
    }
  }

  protected takeDragObj(pieceElem: HTMLImageElement, elem: MouseEvent) {
    this.dragObj = {
      object: pieceElem,
      shiftX: elem.clientX - pieceElem.getBoundingClientRect().left,
      shiftY: elem.clientY - pieceElem.getBoundingClientRect().top,
      currentDroppable: null,
    };
    Game.addDragStyles(pieceElem);
    this.moveAtCoordinates(elem.pageX, elem.pageY);
  }

  private clickOrDragDelegating(pieceElem: HTMLImageElement, event: MouseEvent, cell: Element | null) {
    if (this.isDragAndDrop) { // Mouse move
      const elemBelow = Game.takeElementBelow(pieceElem, event);
      if (cell) {
        this.removeDragStyles(pieceElem, cell);
      }
      if (
        elemBelow?.closest(`.${setting.classNames.possibleClearCell}`)
        || elemBelow?.closest(`.${setting.classNames.possibleEngagedCell}`)
      ) {
        this.completeMove(elemBelow.id);
        this.isSecondClick = false;
        document.onmousemove = null;
        pieceElem.onmouseup = null;
        return;
      }
    } else if (cell) { // Click
      this.removeDragStyles(pieceElem, cell);
      if (this.pieceActive?.cell === cell.id && this.isSecondClick) {
        this.possibleCellsBacklightRemove();
        this.isSecondClick = false;
        this.pieceActive = undefined;
      }
    }

    document.onmousemove = null;
    pieceElem.onmouseup = null;
  }

  protected onMouseMove(event: MouseEvent) {
    this.isDragAndDrop = true;

    if (this.dragObj) {
      const elemBelow = Game.takeElementBelow(this.dragObj.object, event);

      if (!elemBelow) {
        return;
      }

      this.moveAtCoordinates(event.pageX, event.pageY);

      const droppableBelow = <HTMLElement> elemBelow.closest(`.${setting.classNames.cell}`);

      if (this.dragObj.currentDroppable !== droppableBelow) {
        if (this.dragObj.currentDroppable) {
          Game.removeDragBacklights(this.dragObj.currentDroppable);
        }
        this.dragObj.currentDroppable = droppableBelow;
        if (this.dragObj.currentDroppable) {
          Game.addDragBacklights(this.dragObj.currentDroppable);
        }
      }
    }
  }

  protected static addDragStyles(pieceElem: HTMLImageElement) {
    pieceElem.classList.add('draging');
    document.body.append(pieceElem);
  }

  protected removeDragStyles(pieceElem: HTMLImageElement, cell: Element) {
    cell.appendChild(pieceElem);
    pieceElem.classList.remove('draging');
    this.removeSelectCellsBacklights();
    cell.classList.add(setting.classNames.selectPieceBacklight);
  }

  protected static takeElementBelow(obj: HTMLImageElement, event: MouseEvent): Element | null {
    obj.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    obj.hidden = false;
    return elemBelow ? elemBelow.closest(`.${setting.classNames.cell}`) : null;
  }

  protected moveAtCoordinates(pageX: number, pageY: number) {
    if (this.dragObj) {
      this.dragObj.object.style.left = `${pageX - this.dragObj.shiftX}px`;
      this.dragObj.object.style.top = `${pageY - this.dragObj.shiftY}px`;
    }
  }

  protected selectPiece(cellId: string) {
    this.possibleCellsBacklightRemove();
    this.pieceActive = this.chessBoard.selectPiece(cellId);
    this.possibleCellsBacklightAdd();
  }

  private possibleCellsBacklightAdd() {
    const cells = this.chessBoard.getAllCells();
    this.pieceActive?.element.parentElement?.classList.add(setting.classNames.selectPieceBacklight);
    this.pieceActive?.possibleMoves.forEach((move) => {
      cells.forEach((cell) => {
        if (move === cell.id) {
          if (cell.childElementCount) {
            cell.classList.add(setting.classNames.possibleEngagedCell);
          } else {
            cell.classList.add(setting.classNames.possibleClearCell);
          }
          this.possibleCells.push(cell);
        }
      });
    });
  }

  protected possibleCellsBacklightRemove() {
    this.pieceActive?.element.parentElement?.classList.remove(setting.classNames.selectPieceBacklight);
    this.possibleCells.forEach((cell) => {
      cell.classList.remove(setting.classNames.possibleClearCell);
      cell.classList.remove(setting.classNames.possibleEngagedCell);
    });
    this.possibleCells = [];
  }

  private completeMove(cellId: string) {
    if (this.pieceActive) {
      this.pieceMove(cellId);

      if (this.pieceActive instanceof Pawn
        && (this.pieceActive.cell.indexOf('8') !== -1 || this.pieceActive.cell.indexOf('1') !== -1)
      ) {
        this.initPawnTransformation(this.pieceActive);
      } else {
        this.removeCancelMoveAndCheckValidation(this.pieceActive.color);
      }
      // this.checkRotateChessBoard();
    }
  }

  protected pieceMove(cellId: string) {
    if (this.pieceActive) {
      this.checkBacklightRemove();
      this.moveBacklightRemove();
      this.possibleCellsBacklightRemove();

      this.moveBacklightAdd(cellId);
      this.takeActivePlayer(cellId);
      this.chessBoard.pieceMove(cellId, this.pieceActive);
    }
  }

  private initPawnTransformation(piece: Pawn) {
    const popup = this.createChoosePiecePopup(piece.color);
    popup.showPopup();
    popup.element.addEventListener('click', (event) => {
      if (event.target instanceof HTMLImageElement) {
        const fullName = piece.color + event.target.alt;
        this.replaceTransormPiece(piece, fullName);
        Game.removePopup(popup);
        this.removeCancelMoveAndCheckValidation(piece.color);
      }
    });
  }

  protected replaceTransormPiece(piece: Pawn, fullName: string) {
    for (let i = 0; i < setting.gameSetup.length; i++) {
      if (setting.gameSetup[i].cell === piece.cell) {
        setting.gameSetup[i].piece = fullName;
        break;
      }
    }

    const newPiece = setting.createFunctions[<keyof typeof setting.createFunctions> fullName](piece.cell);
    piece.element.remove();
    const piecePosition = cellNameToCellPosition(piece.cell);
    this.chessBoard.getAllCells()[piecePosition].appendChild(newPiece.element);
    this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1, newPiece);
  }

  protected removeCancelMoveAndCheckValidation(color: string) {
    this.chessBoard.removeCloseMove();
    this.checkMateValidation(color);

    this.pieceActive = undefined;
    this.isWhiteMove = !this.isWhiteMove;
    this.addMoveHolder();
  }

  private takeActivePlayer(newCell: string) {
    if (this.pieceActive) {
      this.activePlayer = this.pieceActive.color === this.firstPlayer?.getColor() ? this.firstPlayer : this.secondPlayer;
      this.activePlayer?.moveTable.addMove(
        this.pieceActive.name,
        this.activePlayer.getColor(),
        this.pieceActive.cell,
        newCell,
        timeFunctions.getStringTime(timer.getTimeNow()),
        setting.gameSetup,
      );
    } else {
      throw new Error('pieceActive does not exist!');
    }
  }

  protected moveBacklightAdd(newCell: string) {
    const cells = this.chessBoard.getAllCells();
    cells.forEach((cell) => {
      if (this.pieceActive?.cell === cell.id || newCell === cell.id) {
        cell.classList.add(setting.classNames.moveBacklight);
      }
    });
  }

  protected moveBacklightRemove() {
    const cells = this.chessBoard.getAllCells();
    cells.forEach((cell) => {
      if (cell.classList.contains(setting.classNames.moveBacklight)) {
        cell.classList.remove(setting.classNames.moveBacklight);
      }
    });
  }

  protected static addDragBacklights(cell: HTMLElement) {
    cell.classList.add(setting.classNames.selectPieceBacklight);
  }

  protected static removeDragBacklights(cell: HTMLElement) {
    cell.classList.remove(setting.classNames.selectPieceBacklight);
  }

  protected removeSelectCellsBacklights() {
    this.chessBoard.getAllCells().forEach((cell) => {
      cell.classList.remove(setting.classNames.selectPieceBacklight);
    });
  }

  protected checkMateValidation(movedPieceColor: string) {
    const isCheck = this.chessBoard.checkValidation(movedPieceColor);
    const defendersCanMove = this.chessBoard.movePossibilityValidation(movedPieceColor);

    if (isCheck && !defendersCanMove) {
      // Do some logic for check-mate
      this.checkBacklightAdd();
      this.createEndGame(true, this.activePlayer);
      this.isEndGame = true;
    } else if (isCheck) {
      // Do some logic for check
      this.checkBacklightAdd();
      console.log('check');
    } else if (!defendersCanMove) {
      // Do some logic for stalemate
      this.createEndGame(false);
      this.isEndGame = true;
    }

    if (this.chessBoard.pieces.length === 2) {
      this.createEndGame(false);
      this.isEndGame = true;
    }
  }

  createEndGame(isWin: boolean, winner?: PlayerStatistics) {
    timer.stopTimer();
    if (isWin && winner) {
      this.createWinPopup(winner.getName());
      this.createReplay(winner.getPlayer().getNameWithAvatar());
    } else {
      this.createDrawPopup();
      this.createReplay(null);
    }
  }

  private createReplay(winner: PlayerDBObject | null) {
    if (this.firstPlayer && this.secondPlayer && this.activePlayer) {
      const firstPlayerWithMove = this.firstPlayer?.getPlayerWithMoves();
      const secondPlayerWithMove = this.secondPlayer?.getPlayerWithMoves();
      const moveAmount = firstPlayerWithMove.moves.length + secondPlayerWithMove.moves.length;

      storage.addReplay(
        firstPlayerWithMove,
        secondPlayerWithMove,
        winner,
        moveAmount,
        timeFunctions.getStringTime(timer.getTimeNow())
        );
    }
  }

  protected createWinPopup(name: string) {
    this.createPopup(`${name} won!`);
  }

  protected createDrawPopup() {
    this.createPopup('Draw!');
  }

  private createPopup(text: string) {
    const popup = new Popup();
    popup.btnsInit();
    popup.text.innerHTML = text;
    this.element.parentElement?.appendChild(popup.element);
    popup.showPopup();
    popup.element.addEventListener('click', () => {
      Game.removePopup(popup);
    }, { once: true });
  }

  protected static createConfirmDrawPopup(): Popup {
    const popup = new Popup();
    popup.element.id = 'confirm-popup';
    popup.text.innerHTML = 'The opponent offers a draw';
    return popup;
  }

  protected checkBacklightAdd(color: string | undefined = this.pieceActive?.color) {
    if (color) {
      this.checkPieces = this.chessBoard.getCheckPieces(color);
      this.checkPieces.forEach((piece) => {
        piece.element.parentElement?.classList.add(setting.classNames.checkBacklight);
      });
    }
  }

  protected checkBacklightRemove() {
    if (this.checkPieces) {
      this.checkPieces.forEach((piece) => {
        piece.element.parentElement?.classList.remove(setting.classNames.checkBacklight);
      });
    }
  }

  private checkRotateChessBoard() {
    if (setting.isTwoPlayersOffline) {
      this.rotateChessBoard();
    }
  }

  protected rotateChessBoard() {
    this.chessBoard.element.classList.toggle(setting.classNames.game.rotate);
    this.chessBoard.element.classList.toggle(setting.classNames.game.noRotate);
  }

  protected addMoveHolder() {
    const whitePlayer = this.firstPlayer?.getColor() === color.white ? this.firstPlayer : this.secondPlayer;
    const blackPlayer = this.firstPlayer?.getColor() === color.black ? this.firstPlayer : this.secondPlayer;

    if (this.isWhiteMove) {
      whitePlayer?.getPlayer().getAvatar().classList.add(setting.classNames.game.playerActive);
      blackPlayer?.getPlayer().getAvatar().classList.remove(setting.classNames.game.playerActive);
    } else {
      whitePlayer?.getPlayer().getAvatar().classList.remove(setting.classNames.game.playerActive);
      blackPlayer?.getPlayer().getAvatar().classList.add(setting.classNames.game.playerActive);
    }
  }

  getPlayerStatistics(): { firstPlayer: PlayerStatistics, secondPlayer: PlayerStatistics } {
    if (this.firstPlayer && this.secondPlayer) {
      return { firstPlayer: this.firstPlayer, secondPlayer: this.secondPlayer };
    }
    throw new Error('Players does not exist!');
  }

  surrender() {
    const whitePlayer = this.firstPlayer?.getColor() === color.white ? this.firstPlayer : this.secondPlayer;
    const blackPlayer = this.firstPlayer?.getColor() === color.black ? this.firstPlayer : this.secondPlayer;

    if (this.isWhiteMove) {
      this.createEndGame(true, blackPlayer);
    } else {
      this.createEndGame(true, whitePlayer);
    }
    this.isEndGame = true;
  }

  draw() {
    const popup = Game.createConfirmDrawPopup();
    popup.confirmPopupBtns();
    this.element.parentElement?.appendChild(popup.element);
    popup.showPopup();
    popup.element.addEventListener('click', async (event) => {
      await popup.closePopup();
      popup.element.remove();
      if ((<Element>event.target).classList.contains(setting.classNames.popups.popupLobbyBtn)) {
        this.createEndGame(false);
        this.isEndGame = true;
      }
    }, { once: true });
  }

  protected createChoosePiecePopup(color: string): Popup {
    const popup = new Popup();
    popup.text.innerHTML = 'Choose new piece';

    const pieceContainer = createElement(['choose-piece']);
    pieceContainer.innerHTML = `
    <img class="choose-piece__each" src="./chess/${color}-queen.svg" alt="Queen">
    <img class="choose-piece__each" src="./chess/${color}-rook.svg" alt="Rook">
    <img class="choose-piece__each" src="./chess/${color}-knight.svg" alt="Knight">
    <img class="choose-piece__each" src="./chess/${color}-bishop.svg" alt="Bishop">
    `;
    popup.element.appendChild(pieceContainer);
    this.element.parentElement?.appendChild(popup.element);

    return popup;
  }

  protected static async removePopup(popup: Popup) {
    await popup.closePopup();
    popup.element.remove();
  }
}
