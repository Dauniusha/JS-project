import { cellCoordinatesToName } from '../../shared/cell-coordinates-to-cell-name';
import { cellNameToCellPosition } from '../../shared/cell-name-to-cell-position';
import { cellNameToCoordinates } from '../../shared/cell-name-to-coordinates';
import { Bishop } from '../chess-pieces/each-pieces/bishop';
import { King } from '../chess-pieces/each-pieces/king';
import { Knight } from '../chess-pieces/each-pieces/knight';
import { Pawn } from '../chess-pieces/each-pieces/pawn';
import { Queen } from '../chess-pieces/each-pieces/queen';
import { Rook } from '../chess-pieces/each-pieces/rook';
import { BaseComponents } from '../models/base-component';
import { color } from '../models/game/color-interface';
import { Coordinates } from '../models/game/coordinates-interface';
import { Setup } from '../models/setup-interface';
import { TestCapturedPiece } from '../models/game/test-capturing-interface';
import { setting } from '../settings/setting';
import './chess-board.scss';
import { colorFunctions } from '../../shared/color';

export class ChessBoard extends BaseComponents {
  private readonly cells: HTMLElement[];

  private pieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = []; // TODO: Не понимаю, как сделать через полиморфизм, все компоненты наследуются от одного родителя и все имеют одинаковый перегруженный метод

  private allMoves: { cell: string, moves: string[] }[] = [];

  constructor(gameSetup: Setup[]) {
    super('div', [setting.classNames.board, setting.classNames.game.noRotate]);

    this.cells = this.cellsInit();

    this.element.appendChild(this.boardNumerationInit('number'));
    this.element.appendChild(this.boardNumerationInit('letter'));

    this.newPlacePieces(gameSetup);

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

  private newPlacePieces(setups: Setup[]) {
    setups.forEach((setup) => {
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
      this.capturingEnPassantValidation(piece);
    });
    this.castlingDetermination();
    this.updateAllPossibleMoves();
  }

  private updateAllPossibleMoves() {
    this.allMoves = [];
    this.pieces.forEach((piece) => {
      this.allMoves.push({ cell: piece.cell, moves: piece.possibleMoves });
    });
  }

  private capturingEnPassantValidation(piece: Queen | King | Knight | Bishop | Pawn | Rook) {
    if (piece instanceof Pawn) {
      const pawnPosition = cellNameToCoordinates(piece.cell);
      const needY = piece.getPawnIncrement() > 0 ? setting.passantCell.positiveIncrement : setting.passantCell.negativeIncrement;
      const needPosition: Coordinates = { X: pawnPosition.X, Y: needY };

      if (JSON.stringify(pawnPosition) === JSON.stringify(needPosition)) {
        this.passantInDirection(piece, 1);
        this.passantInDirection(piece, -1);
      }
    }
  }

  private passantInDirection(piece: Pawn, directionIncrement: number) {
    const pawnPosition = cellNameToCoordinates(piece.cell);
    const newCoordinates = { X: pawnPosition.X + directionIncrement, Y: pawnPosition.Y + piece.getPawnIncrement()};
    const cell = cellCoordinatesToName(newCoordinates);

    const enemyPawnCoordinates = { X: pawnPosition.X + directionIncrement, Y: pawnPosition.Y };
    const enemyPawnCell = cellCoordinatesToName(enemyPawnCoordinates);

    if (this.passantPiecesValidation(enemyPawnCell)) {
      piece.possibleMoves.push(cell);
    }
  }

  private passantPiecesValidation(cell: string): boolean {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.cell === cell && piece instanceof Pawn && piece.canBeCapturedEnPassant) {
        return true;
      }
    }
    return false;
  }
  

  private castlingDetermination() {
    this.castlingForEachPiece(color.white);
    this.castlingForEachPiece(color.black);
  }

  private castlingForEachPiece(color: string) {
    const king = this.kingSearcher(color);
    const kingCoordinates = cellNameToCoordinates(king.cell);

    if (this.castlingValidationInDirection(king, 1)) {
      king.possibleMoves.push(cellCoordinatesToName({ X: kingCoordinates.X + 2, Y: kingCoordinates.Y }));
    }
    if (this.castlingValidationInDirection(king, -1)) {
      king.possibleMoves.push(cellCoordinatesToName({ X: kingCoordinates.X - 2, Y: kingCoordinates.Y }));
    }
  }

  private kingSearcher(color: string): King {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece instanceof King && piece.color === color) {
        return piece;
      }
    }
    throw Error('King does not exist!');
  }

  private castlingValidationInDirection(piece: King, directionIncrement: number): boolean {
    if (piece.isFirstMove) {
      const kingPosition = cellNameToCoordinates(piece.cell);
      const attakingColor = colorFunctions.getReverseColor(piece.color);
      
      return this.clearCellAndRookValidation(kingPosition, directionIncrement)
        || this.castlingCellInCheckValidation(attakingColor, kingPosition, directionIncrement) 
        ? false : true;
    } else {
      return false;
    }
  }

  private clearCellAndRookValidation(kingPosition: Coordinates, directionIncrement: number): boolean {
    let rook: Rook | undefined;

    for (let i = kingPosition.X + directionIncrement; i < 8 && i > -1; i += directionIncrement) {
      if (i === 7 || i === 0) {
        for(let j = 0; j < this.pieces.length; j++) {
          if (this.pieces[j].cell === cellCoordinatesToName({ X: i, Y: kingPosition.Y })
              && this.pieces[j] instanceof Rook) {
            rook = <Rook> this.pieces[j];
            break;
          }
        }

        return !rook?.isFirstMove ? true : false;
      }

      const cell = cellCoordinatesToName({ X: i, Y: kingPosition.Y });
      for (let j = 0; j < setting.gameSetup.length; j++) {
        if (setting.gameSetup[j].cell === cell) {
          return true;
        }
      }
    }

    throw Error('Breaking bad!');
  }

  private castlingCellInCheckValidation(color: string, kingPosition: Coordinates, directionIncrement: number): boolean {
    const possibleAttakingPositions = this.possibleWhitesOrBlacksMoves(color);
    const barrierUnit = Math.abs(directionIncrement * 2);

    for (
      let i = kingPosition.X;
      i > kingPosition.X - barrierUnit && i < kingPosition.X + barrierUnit; 
      i += directionIncrement) {
        const cell = cellCoordinatesToName({ X: i, Y: kingPosition.Y });
        if (possibleAttakingPositions.indexOf(cell) !== -1) {
          return true;
        }
    }

    return false;
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
    if (piece instanceof Rook || piece instanceof King) {
      this.castlingMove(cell, piece);
      piece.isFirstMove = false;
    }

    this.capturingEnPassantTry(cell, piece);
    this.longPawnMoveReset();
    ChessBoard.longPawnMoveValidation(cell, piece);
    
    this.capturingTry(cell);

    piece.element.remove();
    this.cells[cellNameToCellPosition(cell)].appendChild(piece.element);

    ChessBoard.updateGameSetup(cell, piece);

    piece.cell = cell;
    
    this.allPossibleMoveDetermination();

    this.removeMovesForСheck(color.white);
    this.removeMovesForСheck(color.black);
  }

  private longPawnMoveReset() {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece instanceof Pawn) {
        piece.canBeCapturedEnPassant = false;
      }
    }
  }

  private static longPawnMoveValidation(cell: string, piece: Queen | King | Knight | Bishop | Pawn | Rook) {
    const cellPosition = cellNameToCoordinates(cell);
    const pieceCellPosition = cellNameToCoordinates(piece.cell);

    if (piece instanceof Pawn) {
      piece.canBeCapturedEnPassant = Math.abs(cellPosition.Y - pieceCellPosition.Y) === 2 ? true : false;
    }
  }

  private capturingEnPassantTry(cell: string, piece: Queen | King | Knight | Bishop | Pawn | Rook) {
    if (piece instanceof Pawn) {
      const cellCoordinates = cellNameToCoordinates(cell);
      const pawnCoordinates = cellNameToCoordinates(piece.cell);
      const increment = cellCoordinates.X - pawnCoordinates.X;

      if (increment) {
        const needCell = cellCoordinatesToName({ X: pawnCoordinates.X + increment, Y: pawnCoordinates.Y });

        for (let i = 0; i < this.pieces.length; i++) {
          const piece = this.pieces[i];

          if (piece instanceof Pawn && piece.cell === needCell && piece.canBeCapturedEnPassant) {
            for (let j = 0; j < setting.gameSetup.length; j++) {
              if (setting.gameSetup[j].cell === needCell) {
                setting.gameSetup.splice(j, 1);
                break;
              }
            }
            
            piece.element.remove();
            this.pieces.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  private static updateGameSetup(cell: string, piece: Queen | King | Knight | Bishop | Pawn | Rook) {
    for (let i = 0; i < setting.gameSetup.length; i++) {
      if (setting.gameSetup[i].cell === piece.cell) {
        setting.gameSetup[i].cell = cell;
        break;
      }
    }
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

  private castlingMove(cell: string, piece: Queen | King | Knight | Bishop | Pawn | Rook) {
    const cellPosition = cellNameToCoordinates(cell);
    const piecePosition = cellNameToCoordinates(piece.cell);
    if (
        piece instanceof King && piece.isFirstMove &&
        (cellPosition.X === piecePosition.X + 2 || cellPosition.X === piecePosition.X - 2)
      ) {
        const directionIncrement = (cellPosition.X - piecePosition.X) / 2;
        const rookX = directionIncrement > 0 ? 7 : 0;
        const rookPosition = cellCoordinatesToName({ X: rookX, Y: piecePosition.Y });
        let rook: Rook | undefined;

        for (let i = 0; i < this.pieces.length; i++) {
          if (this.pieces[i].cell === rookPosition && this.pieces[i] instanceof Rook) {
            rook = <Rook> this.pieces[i];
            break;
          }
        }
        
        if (!rook) {
          throw Error('Rook does not exist!');
        }

        const newRookCell = cellCoordinatesToName({ X: piecePosition.X + directionIncrement, Y: piecePosition.Y });

        rook.element.remove();
        this.cells[cellNameToCellPosition(newRookCell)].appendChild(rook.element);

        ChessBoard.updateGameSetup(newRookCell, rook);

        rook.cell = newRookCell;
    }
  }

  /////////////////////////

  private removeMovesForСheck(movedPieceColor: string) {
    const copyGameSetup: Setup[] = JSON.parse(JSON.stringify(setting.gameSetup));
    const kingColor = colorFunctions.getReverseColor(movedPieceColor);

    this.possibleMoveDeterminationInCheck(kingColor, copyGameSetup);
  }

  private possibleMoveDeterminationInCheck(kingColor: string, copyGameSetup: Setup[]) {
    const defendingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = [];
    const attakingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[] = [];
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
        let capturedPiece = this.testCapturing(copyGameSetup, piece, attakingPieces, piece.possibleMoves[i]);
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
      if (!attakingPieces.length) { // capture attaking king
        return false;
      }
      const kingColor = attakingPieces[0].color === color.white ? color.black : color.white;
      const defendingKingPosition = ChessBoard.getKingPosition(copyGameSetup, kingColor);

      const possibleAttakingPositions: string[] = [];

      attakingPieces.forEach((piece) => {
        const copy = Object.assign(Object.create( Object.getPrototypeOf(piece)), piece); // Cloning object with needed prototype
        copy.possibleMoveDetermination(copyGameSetup);
        possibleAttakingPositions.push(...copy.possibleMoves);
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
    ): TestCapturedPiece | undefined {
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

      this.testCapturingEnPassant(capturedPieceSetup, capturedPiece, testCell, copyGameSetup, piece, attakingPieces);
      if (capturedPiece && capturedPieceSetup) {
        return { capturedPieceSetup: capturedPieceSetup, capturedPiece: capturedPiece };
      }
  }

  private testCapturingEnPassant(
    capturedPieceSetup: Setup | undefined,
    capturedPiece: Queen | King | Knight | Bishop | Pawn | Rook | undefined,
    testCell: string,
    copyGameSetup: Setup[],
    piece: Queen | King | Knight | Bishop | Pawn | Rook,
    attakingPieces: (Queen | King | Knight | Bishop | Pawn | Rook)[],
  ) {
    if (piece instanceof Pawn) {
      const cellCoordinates = cellNameToCoordinates(testCell);
      const needCell = cellCoordinatesToName({ X: cellCoordinates.X, Y: cellCoordinates.Y - piece.getPawnIncrement()});

      for (let i = 0; i < attakingPieces.length; i++) {
        const piece = attakingPieces[i];

        if (piece instanceof Pawn && piece.cell === needCell && piece.canBeCapturedEnPassant) {
          for (let j = 0; j < copyGameSetup.length; j++) {
            if (copyGameSetup[j].cell === needCell) {
              capturedPieceSetup = copyGameSetup[j];
              copyGameSetup.splice(j, 1);
              break;
            }
          }
          
          capturedPiece = piece;
          attakingPieces.splice(i, 1);
          break;
        }
      }
    }
  }

  ////////////////////////////

  checkValidation(movedPieceColor: string): boolean {
    const kingColor = colorFunctions.getReverseColor(movedPieceColor);
    const kingPosition = ChessBoard.getKingPosition(setting.gameSetup, kingColor);

    return this.possibleWhitesOrBlacksMoves(movedPieceColor).indexOf(kingPosition) !== -1 ? true : false;
  }

  movePossibilityValidation(movedPieceColor: string): boolean {
    const defendingColor = colorFunctions.getReverseColor(movedPieceColor);

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
    const kingColor = colorFunctions.getReverseColor(movedPieceColor);
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
}