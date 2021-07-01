import { ChessBoard } from '../chess-board/chess-board';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { color } from '../models/color-interface';
import { Setup } from '../models/setup-interface';
import { setting } from '../settings/setting';
// import './game.css';

export class Game {
  private readonly chessBoard: ChessBoard;

  private possibleCells: HTMLElement[] = [];

  private pieceActive?: Queen | King | Knight | Bishop | Pawn | Rook;

  private isWhiteMove: boolean = true;

  private checkPieces?: (Queen | King | Knight | Bishop | Pawn | Rook)[];

  constructor() {
    this.chessBoard = new ChessBoard();

    this.chessBoardListnersInit();
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
      } else if (pieceElem /* && pieceElem.getAttribute(setting.classNames.dataPiece)?.indexOf(activeColor) !== -1 */) {
          const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
          if (cell && !(this.pieceActive?.cell === cell.id && this.possibleCells.length !== 0)) {
            this.selectPiece(cell.id);
          } else {
            this.possibleCellsBacklightRemove();
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
      this.chessBoard.pieceMove(cellId, this.pieceActive);

      this.checkMateValidation(this.pieceActive.color);
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
      console.log('mate');
    } else if (isCheck) {
      // Do some logic for check
      this.checkBacklightAdd();
      console.log('check');
    } else if (!defendersCanMove) {
      // Do some logic for stalemate
      console.log('stalemate');
    }
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
}