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
      this.makeEnemyOnlineMove(event.data);
    });

    this.socket.addEventListener('close', () => {
      this.createEndGame(true, this.secondPlayer?.getName());
    });
  }

  private makeEnemyOnlineMove(message: string) {
    if (message === 'disconnected') {
      this.createEndGame(true, this.firstPlayer?.getName());
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
}