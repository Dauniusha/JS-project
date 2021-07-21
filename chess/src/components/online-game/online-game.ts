import { Game } from "../game/game";
import { MessageReader } from "../../shared/server-message-reader";
import { color } from "../models/game/color-interface";
import { setting } from "../settings/setting";
import { Pawn } from "../chess-pieces/each-pieces/pawn";

export class OnlineGame extends Game {
  private readonly color: string;

  constructor(color: string, private socket: WebSocket) {
    super(undefined, color);
    if (color === 'black') {
      this.rotateChessBoard();
    }
    this.color = color;
    this.initListner();
    this.makeMoveAndSendData();
  }

  private initListner() {
    this.socket.addEventListener('message', (event: MessageEvent<string>) => {
      switch(event.data) {
        case 'draw':
          this.confirmDrawPopup();
          break;
        case 'confirm draw':
          this.createEndGame(false);
          this.isEndGame = true;
          break;
        case 'refuse draw':
          break;
        case 'surrender':
          this.createEndGame(true, this.firstPlayer?.getName());
          this.isEndGame = true;
          break;
        case 'Bishop':
        case 'Rook':
        case 'Queen':
        case 'Knight':
          this.transformPieceFromMessage(event.data);
          break;
        default:
          this.makeEnemyOnlineMove(event.data);
          break;
      }
    });

    this.socket.addEventListener('close', () => {
      if (!this.isEndGame) {
        this.createEndGame(true, this.secondPlayer?.getName());
        this.isEndGame = true;
      }
    });
  }

  private confirmDrawPopup() {
    const popup = Game.createConfirmDrawPopup();
    popup.confirmPopupBtns();
    this.element.parentElement?.appendChild(popup.element);
    popup.showPopup();
    popup.element.addEventListener('click', async (event) => {
      await popup.closePopup();
      popup.element.remove();
      if ((<Element>event.target).classList.contains(setting.classNames.popups.popupLobbyBtn)) {
        this.socket.send('confirm draw');
        this.createEndGame(false);
        this.isEndGame = true;
      } else {
        this.socket.send('refuse draw');
      }
    }, { once: true });
  }

  private transformPieceFromMessage(pieceName: string) {
    for (let i = 0; i < this.chessBoard.pieces.length; i++) {
      const piece = this.chessBoard.pieces[i];
      if (piece instanceof Pawn && (piece.cell.indexOf('8') !== -1 || piece.cell.indexOf('1') !== -1)) {
        this.pieceActive = piece;
        const fullName = piece.color + pieceName;
        this.replaceTransormPiece(piece, fullName);
        this.chessBoard.removeCloseMove();
        this.checkMateValidation(piece.color);
        this.pieceActive = undefined;
        return;
      }
    }
  }

  private makeEnemyOnlineMove(message: string) {
    if (message === 'disconnected') {
      if (!this.isEndGame) {
        this.createEndGame(true, this.firstPlayer?.getName());
        this.isEndGame = true;
      }
      return;
    }

    const [ startCell, endCell ] = MessageReader.readMessage(message);
    this.pieceActive = this.chessBoard.selectPiece(startCell);

    this.pieceMove(endCell);

    this.removeCancelMoveAndCheckValidation(this.pieceActive.color);
  }

  private makeOnlineCompleteMove(cellId: string) {
    if (this.pieceActive) {
      this.socket.send(MessageReader.writeMessage(this.pieceActive.cell, cellId));

      this.pieceMove(cellId);

      if (this.pieceActive instanceof Pawn && (this.pieceActive.cell.indexOf('8') !== -1 || this.pieceActive.cell.indexOf('1') !== -1)) {
        this.initOnlinePawnTransformation(this.pieceActive);
      } else {
        this.removeCancelMoveAndCheckValidation(this.pieceActive.color);
      }
    }
  }

  private initOnlinePawnTransformation(piece: Pawn) {
    const popup = this.createChoosePiecePopup(piece.color);
    popup.showPopup();
    popup.element.addEventListener('click', (event) => {
        if (event.target instanceof HTMLImageElement) {
          const name = event.target.alt;
          const fullName = piece.color + name;
          this.socket.send(name);
          this.replaceTransormPiece(piece, fullName);
          Game.removePopup(popup);
          this.removeCancelMoveAndCheckValidation(piece.color);
        }
    });
  }

  private makeMoveAndSendData() {
    this.chessBoard.element.addEventListener('click', (elem) => {
      const pieceElem = (<Element>elem.target)?.closest('.' + setting.classNames.piece);
      const activeColor = this.isWhiteMove ? color.white : color.black;

      if (
      (<Element>elem.target)?.closest('.' + setting.classNames.possibleClearCell)
      || (<Element>elem.target)?.closest('.' + setting.classNames.possibleEngagedCell)
      ) {
        const cell = (<Element>elem.target)?.closest('.' + setting.classNames.cell);
        if (cell && this.pieceActive) {
          console.log(this.pieceActive.cell);
          this.makeOnlineCompleteMove(cell.id);
        }
      } else if (pieceElem && pieceElem.getAttribute(setting.classNames.dataPiece)?.indexOf(activeColor) !== -1 && activeColor === this.color) {
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

  surrenderBtnEvent() {
    this.socket.send('surrender');
    this.createEndGame(true, this.secondPlayer?.getName());
    this.isEndGame = true;
  }

  drawBtnEvent() {
    this.socket.send('draw');
  }

  offSocket() {
    this.socket.close();
  }
}