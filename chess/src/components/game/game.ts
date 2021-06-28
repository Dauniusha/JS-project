import { ChessBoard } from '../chess-board/chess-board';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { setting } from '../settings/setting';
// import './game.css';

export class Game {
  private readonly chessBoard: ChessBoard;

  private possibleCells: HTMLElement[] = [];

  private pieceActive?: Queen | King | Knight | Bishop | Pawn | Rook;

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
        if (cell && !(this.pieceActive?.cell === cell.id && this.possibleCells.length !== 0)) {
          this.selectPiece(cell.id);
        } else {
          this.removePossibleCells();
        }
      } else if (
        (<Element>elem.target)?.closest('.' + setting.classNames.possibleClearCell)
        || (<Element>elem.target)?.closest('.' + setting.classNames.possibleEngagedCell)
        ) { // Происходит запись хода и всё остальное
          const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
          if (cell) {
            this.pieceMove(cell.id);
          }
      } else {
        this.removePossibleCells();
      }
    });
  }

  private selectPiece(cellId: string) {
    this.removePossibleCells();
    this.pieceActive = this.chessBoard.selectPiece(cellId);
    const cells = this.chessBoard.getAllCells();
    this.pieceActive.possibleMoves.forEach((move) => {
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
    this.possibleCells = [];
  }

  private pieceMove(cellId: string) {
    if (this.pieceActive) {
      this.chessBoard.pieceMove(cellId, this.pieceActive);
      this.removePossibleCells();
    }
  }

  private checkValidation() {
    
  }
}