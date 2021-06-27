import { ChessBoard } from '../chess-board/chess-board';
import { setting } from '../settings/setting';
// import './game.css';

export class Game {
  private readonly chessBoard: ChessBoard;

  private possibleCells: HTMLElement[] = [];

  constructor() {
    this.chessBoard = new ChessBoard();

    this.chessBoardListnersInit();
  }

  getChessBoard(): ChessBoard {
    return this.chessBoard;
  }

  private chessBoardListnersInit() {
    this.chessBoard.element.addEventListener('click', (elem) => {
      if ((<Element>elem.target)?.closest('.' + setting.classNames.piece)) {
        const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
        if (cell) {
          this.selectPiece(cell.id);
        }
      }
    });
  }

  private selectPiece(cellId: string) {
    this.removePossibleCells();
    const possibleMoves = this.chessBoard.selectPiece(cellId);
    const cells = this.chessBoard.getAllCells();
    possibleMoves.forEach((move) => {
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

  private removePossibleCells() {
    this.possibleCells.forEach((cell) => {
      cell.classList.remove(setting.classNames.possibleClearCell);
      cell.classList.remove(setting.classNames.possibleEngagedCell);
    });
  }

}