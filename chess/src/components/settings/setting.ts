import { Bishop } from "../chess-pieces/each-pieces/bishop";
import { King } from "../chess-pieces/each-pieces/king";
import { Knight } from "../chess-pieces/each-pieces/knight";
import { Pawn } from "../chess-pieces/each-pieces/pawn";
import { Queen } from "../chess-pieces/each-pieces/queen";
import { Rook } from "../chess-pieces/each-pieces/rook";
import { color } from "../models/game/color-interface";

export let setting = {
  classNames: {
    board: 'chess-board',
    cell: 'cell',
    whiteCell: 'white-cell',
    blackCell: 'black-cell',
    numerationAll: 'cell-numeration',
    numerationEach: 'cell-nnumeration__each',
    letterId: 'letter',
    numberId: 'number',
    piece: 'piece',
    dataPiece: 'piece-type',
    possibleClearCell: 'possible-clear-ceil',
    possibleEngagedCell: 'possible-engaged-ceil',
    moveBacklight: 'move-backlight',
    checkBacklight: 'check-backlight',
    selectPieceBacklight: 'select-piece-backlight',
    headers: {
      header: 'header',
      container: 'header__container',
      logo: 'header-logo',
      logoImg: 'header-logo__img',
      logoText: 'header-logo__text',
    },
    lobby: {
      lobby: 'lobby',
      container: 'lobby__container',
      menu: {
        menu: 'menu',
        replay: 'menu-replay',
        replayText: 'menu-replay__text',
        replayImg: 'menu-replay__img',
        setting: 'menu-setting',
        settingImg: 'menu-setting__inner',
        start: 'menu-start',
        startText: 'menu-start__text',
        gameMode: 'game-mode',
      }
    },
    player: {
      player: 'player',
      avatar: 'player__avatar',
      gameAvatar: 'player__game-avatar',
      name: 'player__name',
    },
    game: {
      playerStatistics: 'player-statistics',
      playerMoveTable: 'player-statistics__table',
      playerMoveTableEach: 'player-statistics__table-each',
      playerMoveTableImg: 'player-statistics__table-img',
      playerMoveTableCells: 'player-statistics__table-cells',
      playerMoveTableTime: 'player-statistics__table-time',
    }
  },

  gameSetup: [
    { cell: 'a8', piece: 'blackRook' },
    { cell: 'b8', piece: 'blackKnight' },
    { cell: 'c8', piece: 'blackBishop' },
    { cell: 'd8', piece: 'blackQueen' },
    { cell: 'e8', piece: 'blackKing' },
    { cell: 'f8', piece: 'blackBishop' },
    { cell: 'g8', piece: 'blackKnight' },
    { cell: 'h8', piece: 'blackRook' },
    { cell: 'a7', piece: 'blackPawn' },
    { cell: 'b7', piece: 'blackPawn' },
    { cell: 'c5', piece: 'blackPawn' },
    { cell: 'd6', piece: 'blackPawn' },
    { cell: 'e7', piece: 'blackPawn' },
    { cell: 'f7', piece: 'blackPawn' },
    { cell: 'g7', piece: 'blackPawn' },
    { cell: 'h7', piece: 'blackPawn' },

    { cell: 'a1', piece: 'whiteRook' },
    { cell: 'b1', piece: 'whiteKnight' },
    { cell: 'c1', piece: 'whiteBishop' },
    { cell: 'd1', piece: 'whiteQueen' },
    { cell: 'e1', piece: 'whiteKing' },
    { cell: 'f1', piece: 'whiteBishop' },
    { cell: 'g1', piece: 'whiteKnight' },
    { cell: 'h1', piece: 'whiteRook' },
    { cell: 'a2', piece: 'whitePawn' },
    { cell: 'b2', piece: 'whitePawn' },
    { cell: 'c2', piece: 'whitePawn' },
    { cell: 'd2', piece: 'whitePawn' },
    { cell: 'e5', piece: 'whitePawn' },
    { cell: 'f2', piece: 'whitePawn' },
    { cell: 'g2', piece: 'whitePawn' },
    { cell: 'h2', piece: 'whitePawn' },
  ],

  imgNames: {
    blackQueen: './chess/black-queen.svg',
    blackKing: './chess/black-king.svg',
    blackBishop: './chess/black-bishop.svg',
    blackKnight: './chess/black-knight.svg',
    blackRook: './chess/black-rook.svg',
    blackPawn: './chess/black-pawn.svg',
    
    whiteQueen: './chess/white-queen.svg',
    whiteKing: './chess/white-king.svg',
    whiteBishop: './chess/white-bishop.svg',
    whiteKnight: './chess/white-knight.svg',
    whiteRook: './chess/white-rook.svg',
    whitePawn: './chess/white-pawn.svg',
  },

  createFunctions: {
    blackQueen: (position: string) => new Queen(position, color.black),
    blackKing: (position: string) => new King(position, color.black),
    blackBishop: (position: string) => new Bishop(position, color.black),
    blackKnight: (position: string) => new Knight(position, color.black),
    blackRook: (position: string) => new Rook(position, color.black),
    blackPawn: (position: string) => new Pawn(position, color.black),
    
    whiteQueen: (position: string) => new Queen(position, color.white),
    whiteKing: (position: string) => new King(position, color.white),
    whiteBishop: (position: string) => new Bishop(position, color.white),
    whiteKnight: (position: string) => new Knight(position, color.white),
    whiteRook: (position: string) => new Rook(position, color.white),
    whitePawn: (position: string) => new Pawn(position, color.white),
  },

  isWhiteFromBelow: true,

  passantCell: {
    positiveIncrement: 4,
    negativeIncrement: 3,
  },

  startPage: '#/Lobby',
}