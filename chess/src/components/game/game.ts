import { colorFunctions } from '../../shared/color';
import { ChessBoard } from '../chess-board/chess-board';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { BaseComponents } from '../models/base-component';
import { color } from '../models/game/color-interface';
import { PlayerStatistics } from '../player-statistics/player-statistics';
import { Popup } from '../popup/popup';
import { setting } from '../settings/setting';
import './game.css';

export class Game extends BaseComponents {
  private readonly chessBoard: ChessBoard;

  private possibleCells: HTMLElement[] = [];

  private pieceActive?: Queen | King | Knight | Bishop | Pawn | Rook;

  private isWhiteMove: boolean = true;

  private checkPieces?: (Queen | King | Knight | Bishop | Pawn | Rook)[];

  private firstPlayer?: PlayerStatistics;

  private secondPlayer?: PlayerStatistics;

  private activePlayer?: PlayerStatistics;

  constructor(private twoPlayersOffline: boolean) {
    super('section', ['game']);

    [ this.firstPlayer, this.secondPlayer ] = this.playerInit();

    this.chessBoard = new ChessBoard();
    this.element.insertBefore(this.chessBoard.element, this.secondPlayer.element);

    this.chessBoardListnersInit();
  }

  private playerInit(color?: string): PlayerStatistics[] {
    if (!color) {
      color = colorFunctions.getRandomColor();
    }
    const firstPlayer = new PlayerStatistics('Danik', color);
    this.element.appendChild(firstPlayer.element);

    const otherColor = colorFunctions.getReverseColor(color);
    const secondPlayer = new PlayerStatistics('Player 2', otherColor);
    this.element.appendChild(secondPlayer.element);

    return [ firstPlayer, secondPlayer ];
  }

  getChessBoard(): ChessBoard {
    return this.chessBoard;
  }

  private chessBoardListnersInit() {
    this.chessBoard.element.addEventListener('click', (elem) => {
      const pieceElem = (<Element>elem.target)?.closest('.' + setting.classNames.piece);
      const activeColor = this.isWhiteMove ? color.white : color.black;

      if (
      (<Element>elem.target)?.closest('.' + setting.classNames.possibleClearCell)
      || (<Element>elem.target)?.closest('.' + setting.classNames.possibleEngagedCell)
      ) { // Происходит запись хода и всё остальное
        const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
        if (cell) {
          this.pieceMove(cell.id);
          this.isWhiteMove = !this.isWhiteMove;
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
  }

  private selectPiece(cellId: string) {
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

  private possibleCellsBacklightRemove() {
    this.pieceActive?.element.parentElement?.classList.remove(setting.classNames.selectPieceBacklight);
    this.possibleCells.forEach((cell) => {
      cell.classList.remove(setting.classNames.possibleClearCell);
      cell.classList.remove(setting.classNames.possibleEngagedCell);
    });
    this.possibleCells = [];
  }

  private pieceMove(cellId: string) {
    if (this.pieceActive) {
      this.checkBacklightRemove();
      this.moveBacklightRemove();
      this.possibleCellsBacklightRemove();

      this.moveBacklightAdd(cellId);
      this.takeActivePlayer(cellId);
      this.chessBoard.pieceMove(cellId, this.pieceActive);

      this.checkMateValidation(this.pieceActive.color);
      this.rotateChesseBoard();
      this.pieceActive = undefined;
    }
  }

  private takeActivePlayer(newCell: string) {
    if (this.pieceActive) {
      this.activePlayer = this.pieceActive.color === this.firstPlayer?.getColor() ? this.firstPlayer : this.secondPlayer;
      this.activePlayer?.moveTable.addMove(
        this.pieceActive.constructor.name,
        this.activePlayer.getColor(),
        this.pieceActive.cell,
        newCell);
    } else {
      throw new Error('pieceActive does not exist!');
    }
  }

  private moveBacklightAdd(newCell: string) {
    const cells = this.chessBoard.getAllCells();
    cells.forEach((cell) => {
      if (this.pieceActive?.cell === cell.id || newCell === cell.id) {
        cell.classList.add(setting.classNames.moveBacklight);
      } 
    });
  }

  private moveBacklightRemove() {
    const cells = this.chessBoard.getAllCells();
    cells.forEach((cell) => {
      if (cell.classList.contains(setting.classNames.moveBacklight)) {
        cell.classList.remove(setting.classNames.moveBacklight);
      } 
    });
  }

  private checkMateValidation(movedPieceColor: string) {
    const isCheck = this.chessBoard.checkValidation(movedPieceColor);
    const defendersCanMove = this.chessBoard.movePossibilityValidation(movedPieceColor);

    if (isCheck && !defendersCanMove) {
      // Do some logic for check-mate
      this.checkBacklightAdd();
      this.createWinPopup();
    } else if (isCheck) {
      // Do some logic for check
      this.checkBacklightAdd();
      console.log('check');
    } else if (!defendersCanMove) {
      // Do some logic for stalemate
      this.createDrawPopup()
    }
  }

  private createWinPopup() {
    const winnerName = this.activePlayer?.getName();
    this.createPopup(`${winnerName} won!`);
  }

  private createDrawPopup() {
    this.createPopup('Draw!');
  }

  private createPopup(text: string) {
    const popup = new Popup();
    popup.text.innerHTML = text;
    this.element.appendChild(popup.element);
    popup.showPopup();
    popup.element.addEventListener('click', async () => {
      await popup.closePopup();
      popup.element.remove();
    }, { once: true });
  }

  private checkBacklightAdd() {
    if (this.pieceActive) {
      this.checkPieces = this.chessBoard.getCheckPieces(this.pieceActive.color);
      this.checkPieces.forEach((piece) => {
        piece.element.parentElement?.classList.add(setting.classNames.checkBacklight);
      });
    }
  }

  private checkBacklightRemove() {
    if (this.checkPieces) {
      this.checkPieces.forEach((piece) => {
        piece.element.parentElement?.classList.remove(setting.classNames.checkBacklight);
      });
    }
  }

  private rotateChesseBoard() {
    if (this.twoPlayersOffline) {
      if (this.chessBoard.element.classList.contains(setting.classNames.game.rotate)) {
        this.chessBoard.element.classList.remove(setting.classNames.game.rotate);
        this.chessBoard.element.classList.add(setting.classNames.game.noRotate);
      } else {
        this.chessBoard.element.classList.add(setting.classNames.game.rotate);
        this.chessBoard.element.classList.remove(setting.classNames.game.noRotate);
      }
    }
  }
}