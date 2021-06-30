import { cellNameToCellPosition } from '../../shared/cell-name-to-cell-position';
import { BasePiece } from '../chess-pieces/base-piece';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { BaseComponents } from '../models/base-component';
import { color } from '../models/color-interface';
import { Setup } from '../models/setup-interface';
import { TestCapturedPiece } from '../models/test-capturing-interface';
import { setting } from '../settings/setting';
import './chess-board.scss';

export class ChessBoard extends BaseComponents {
  private readonly cells: HTMLElement[];

  private pieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = []; // TODO: Не понимаю, как сделать через полиморфизм, все компоненты наследуются от одного родителя и все имеют одинаковый перегруженный метод

  private allMoves: { cell: string, moves: string[] }[] = [];

  constructor() {
    super('div', [setting.classNames.board]);

    this.cells = this.cellsInit();

    this.element.appendChild(this.boardNumerationInit('number'));
    this.element.appendChild(this.boardNumerationInit('letter'));

    this.newPlacePieces();

    this.allPossibleMoveDetermination();
  }

  private cellsInit(): HTMLElement[] {
    let tempCells: HTMLElement[] = [];
    let needWhite = true;
    for (let i = 8; i >= 1; i--) {
      for (let j = 1; j <= 8; j++) {
        const cell = document.createElement('div');
        cell.id = `${String.fromCharCode(96 + j)}${i}`;
        if (needWhite) {
          cell.classList.add(setting.classNames.cell, setting.classNames.whiteCell);
        } else {
          cell.classList.add(setting.classNames.cell, setting.classNames.blackCell);
        }
        needWhite = !needWhite;
        tempCells.push(cell);
        this.element.appendChild(cell);
      }
      needWhite = !needWhite;
    }
    return tempCells;
  }

  private boardNumerationInit(name: string): HTMLElement {
    const mainComponent = document.createElement('div');
    mainComponent.classList.add(setting.classNames.numerationAll);
    if (name === setting.classNames.numberId) {
      mainComponent.id = setting.classNames.numberId;
      for (let i = 8; i >= 1; i--) {
        const miniNumber = document.createElement('div');
        miniNumber.innerHTML = String(i);
        miniNumber.classList.add(setting.classNames.numerationEach);
        mainComponent.appendChild(miniNumber);
      }
    } else {
      mainComponent.id = setting.classNames.letterId
      for (let i = 1; i <= 8; i++) {
        const miniChar = document.createElement('div');
        miniChar.innerHTML = String.fromCharCode(96 + i);
        miniChar.classList.add(setting.classNames.numerationEach);
        mainComponent.appendChild(miniChar);
      }
    }
    return mainComponent;
  }

  private newPlacePieces() {
    setting.gameSetup.forEach((setup) => {
      const pieceType = setup.piece;
      const piece = setting.createFunctions[<keyof typeof setting.createFunctions> pieceType](setup.cell);
      this.pieces.push(piece);
      const positionInArray = cellNameToCellPosition(setup.cell);
      this.cells[positionInArray].appendChild(piece.element);
    });
  }

  private allPossibleMoveDetermination() {
    this.pieces.forEach((piece) => {
      piece.possibleMoveDetermination(setting.gameSetup);
    });
    this.updateAllPossibleMoves();
  }

  private updateAllPossibleMoves() {
    this.allMoves = [];
    this.pieces.forEach((piece) => {
      this.allMoves.push({ cell: piece.cell, moves: piece.possibleMoves });
    });
  }

  getAllCells(): HTMLElement[] {
    return this.cells;
  }

  selectPiece(cell: string): Queen | King | Knight | Bishop | Pawn | Rook { // TODO: Приходится тащить 6 типов
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].cell === cell) {
        return this.pieces[i];
      }
    }
    throw Error();
  }

  pieceMove(cell: string, piece: Queen | King | Knight | Bishop | Pawn | Rook) { // TODO: Приходится тащить 6 типов
    this.capturingTry(cell);

    piece.element.remove();
    this.cells[cellNameToCellPosition(cell)].appendChild(piece.element);

    setting.gameSetup.forEach((setup) => { // Update gameSetup
      if (setup.cell === piece.cell) {
        setup.cell = cell;
      }
    });

    piece.cell = cell;
    
    this.allPossibleMoveDetermination();
  }

  private capturingTry(cell: string) {
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].cell === cell) {
        for (let i = 0; i < setting.gameSetup.length; i++) {
          if (setting.gameSetup[i].cell === cell) {
            setting.gameSetup.splice(i, 1);
          }
        }

        this.pieces[i].element.remove();
        this.pieces.splice(i, 1);
        break;
      }
    }
  }

  /////////////////////////

  possibleMoveDeterminationInCheck(kingColor: string, copyGameSetup: Setup[]) {
    const defendingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = [];
    const attakingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = []
    this.pieces.forEach((piece) => {
      if (piece.color === kingColor) {
        defendingPieces.push(piece);
      } else {
        attakingPieces.push(piece);
      }
    });

    defendingPieces.forEach((piece) => {
      const truePiecePosition = piece.cell;

      for (let i = 0 ; i < piece.possibleMoves.length; i++) {
        const capturedPiece = this.testCapturing(copyGameSetup, piece, attakingPieces, piece.possibleMoves[i]);
        ChessBoard.moveTesting(copyGameSetup, piece, piece.possibleMoves[i]);

        if (this.testCheckValidation(copyGameSetup, attakingPieces)) {
          piece.possibleMoves.splice(i, 1);
          i--;
        }

        if (capturedPiece) {
          copyGameSetup.push(capturedPiece.capturedPieceSetup);
          attakingPieces.push(capturedPiece.capturedPiece);
        }
      }
      ChessBoard.moveTesting(copyGameSetup, piece, truePiecePosition);
    });
    
    this.updateAllPossibleMoves();
  }

  private testCheckValidation(
    copyGameSetup: Setup[],
    attakingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] // TODO: Приходится тащить 6 типов
    ): boolean {
      const kingColor = attakingPieces[0].color === color.white ? color.black : color.white;
      const defendingKingPosition = ChessBoard.getKingPosition(copyGameSetup, kingColor);


      const possibleAttakingPositions: string[] = [];

      attakingPieces.forEach((piece) => {
        piece.possibleMoveDetermination(copyGameSetup);
        possibleAttakingPositions.push(...piece.possibleMoves);
        piece.possibleMoveDetermination(setting.gameSetup); // Turn back
      });

      return possibleAttakingPositions.indexOf(defendingKingPosition) !== -1 ? true : false;
  }

  private static moveTesting(copyGameSetup: Setup[], piece: Queen | King | Knight | Bishop | Pawn | Rook, testCell: string) {
    for (let i = 0; i < copyGameSetup.length; i++) {
      if (copyGameSetup[i].cell === piece.cell && copyGameSetup[i].piece.indexOf(piece.color) !== -1) {
        copyGameSetup[i].cell = testCell;
        break;
      }
    }

    piece.cell = testCell;
  }

  private testCapturing(
    copyGameSetup: Setup[],
    piece: Queen | King | Knight | Bishop | Pawn | Rook,
    attakingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[],
    testCell: string
    ): TestCapturedPiece | false {
      let capturedPieceSetup: Setup | undefined;

      for (let i = 0; i < copyGameSetup.length; i++) { // Take captured piece
        if (copyGameSetup[i].cell === testCell && copyGameSetup[i].piece.indexOf(piece.color) === -1) {
          capturedPieceSetup = copyGameSetup[i];
          copyGameSetup.splice(i, 1);
          break;
        }
      }

      let capturedPiece: Queen | King | Knight | Bishop | Pawn | Rook | undefined;

      for (let i = 0; i < attakingPieces.length; i++) {
        if (attakingPieces[i].cell === testCell) {
          capturedPiece = attakingPieces[i];
          attakingPieces.splice(i, 1);
          break;
        }
      };

      if (capturedPiece && capturedPieceSetup) {
        return { capturedPieceSetup: capturedPieceSetup, capturedPiece: capturedPiece };
      } else {
        return false;
      }
  }

  ////////////////////////////

  checkValidation(movedPieceColor: string): boolean {
    const kingColor = ChessBoard.getReverseColor(movedPieceColor);
    const kingPosition = ChessBoard.getKingPosition(setting.gameSetup, kingColor);

    return this.possibleWhitesOrBlacksMoves(movedPieceColor).indexOf(kingPosition) !== -1 ? true : false;
  }

  movePossibilityValidation(movedPieceColor: string): boolean {
    const defendingColor = ChessBoard.getReverseColor(movedPieceColor);

    return this.possibleWhitesOrBlacksMoves(defendingColor).length ? true : false;
  }

  private possibleWhitesOrBlacksMoves(movedPieceColor: string): string[] {
    const possibleMoves: string[] = [];

    this.pieces.forEach((piece) => {
      if (piece.color === movedPieceColor) {
        possibleMoves.push(...piece.possibleMoves);
      }
    });

    return possibleMoves;
  }

  getCheckPieces(movedPieceColor: string): (Queen | King | Knight | Bishop | Pawn | Rook)[] {
    const checkPiecesPositions: (Queen | King | Knight | Bishop | Pawn | Rook)[] = [];
    const kingColor = ChessBoard.getReverseColor(movedPieceColor);
    const kingPosition = ChessBoard.getKingPosition(setting.gameSetup, kingColor);
    this.pieces.forEach((piece) => {
      if (piece.possibleMoves.indexOf(kingPosition) !== -1 || piece.cell === kingPosition) {
        checkPiecesPositions.push(piece);
      }
    });
    return checkPiecesPositions;
  }

  private static getKingPosition(gameSetup: Setup[], kingColor: string): string {
    for (let i = 0; i < gameSetup.length; i++) {
      if (gameSetup[i].piece === kingColor + 'King') {
        return gameSetup[i].cell;
      }
    }
    throw Error('King does not exist');
  }

  private static getReverseColor(movedPieceColor: string): string {
    return movedPieceColor === color.white ? color.black : color.white;
  }
}