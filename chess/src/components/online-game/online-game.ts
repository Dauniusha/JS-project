import { Game } from "../game/game";
import { MessageReader } from "../../shared/server-message-reader";
import { color } from "../models/game/color-interface";
import { setting } from "../settings/setting";

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
    this.isWhiteMove = !this.isWhiteMove;
    this.addMoveHolder();
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
          console.log(this.pieceActive?.cell);
          this.socket.send(MessageReader.writeMessage(this.pieceActive?.cell, cell.id));
          this.pieceMove(cell.id);
          this.isWhiteMove = !this.isWhiteMove;
          this.addMoveHolder();
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
}