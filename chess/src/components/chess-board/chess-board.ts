import { cellNameToCellPosition } from '../../shared/cell-name-to-cell-position';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { BaseComponents } from '../models/base-component';
import { setting } from '../settings/setting';
import './chess-board.scss';

export class chessBoard extends BaseComponents {
  private readonly cells: HTMLElement[];

  private pieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = [];

  constructor() {
    super('div', [setting.classNames.board]);

    this.cells = this.cellsInit();

    this.element.appendChild(this.boardNumerationInit('number'));
    this.element.appendChild(this.boardNumerationInit('letter'));

    this.newPlacePieces();
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
    const gameSetup = setting.startGame;
    for (const piecePosition in setting.startGame) {
      const pieceType = gameSetup[<keyof typeof setting.startGame> piecePosition];
      const piece = setting.createFunctions[<keyof typeof setting.createFunctions> pieceType](piecePosition);
      this.pieces.push(piece);

      const positionInArray = 63 - cellNameToCellPosition(piecePosition);
      this.cells[positionInArray].appendChild(piece.element);
    }
  }
}