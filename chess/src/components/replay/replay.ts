import { createElement } from "../../shared/create-element";
import { BaseComponents } from "../models/base-component";
import { PlayerWithMove } from "../models/data-base/data-base-player-move";
import { ReplaysDBObject } from "../models/data-base/data-base-replays-object";
import { setting } from "../settings/setting";
import './replay.css';

export class Replay extends BaseComponents {
  constructor(data: ReplaysDBObject, counter: number) {
    super('a', [ setting.classNames.replays.replaysEach ]);
    (<HTMLAnchorElement>this.element).href = `#/Replays/Watch-replay/${counter}`;
    this.element.title = 'Watch replay';
    
    const firstPlayerElement = Replay.createReplayPieceElement(data.firstPlayer);
    this.element.appendChild(firstPlayerElement);

    const cross = Replay.addCrossImg();
    this.element.appendChild(cross);

    const secondPlayerElement = Replay.createReplayPieceElement(data.secondPlayer);
    this.element.appendChild(secondPlayerElement);

    const timeElement = Replay.createTimerElement(data.time);
    this.element.appendChild(timeElement);

    Replay.createCrownElement(data, firstPlayerElement, secondPlayerElement);
  }

  private static createReplayPieceElement(pieceData: PlayerWithMove): HTMLElement {
    const container = createElement([ setting.classNames.replays.replaysEachContainer ]);

    const pieceProto = Replay.createPieceProtoElement(pieceData.color);
    container.appendChild(pieceProto);

    const playerElement = createElement([ setting.classNames.replays.playerContainer ]);
    container.appendChild(playerElement);

    const avatarElement = createElement([ setting.classNames.replays.avatar ]);
    if (pieceData.player.avatarURL === setting.playersInitStates.playerImgURL) {
      avatarElement.innerHTML = pieceData.player.name[0];
    } else {
      avatarElement.style.backgroundImage = `url(${pieceData.player.avatarURL})`;
    }

    const nameElement = createElement([ setting.classNames.replays.name ]);
    nameElement.innerHTML = pieceData.player.name;

    playerElement.appendChild(avatarElement);
    playerElement.appendChild(nameElement);
    
    return container;
  }

  private static createPieceProtoElement(color: string): HTMLElement {
    const protoName = color + 'Pawn'; // TODO: Выбор фигуры для отображения в реплеях будет в настройках
    const pieceProto = createElement([ setting.classNames.replays.piecePrototype ]);
    pieceProto.style.backgroundImage = `url(${setting.imgNames[<keyof typeof setting.imgNames> protoName]})`;
    return pieceProto;
  }

  private static createTimerElement(time: string): HTMLElement {
    const timeElement = createElement([ setting.classNames.replays.time ]);
    timeElement.innerHTML = time;
    return timeElement;
  }

  private static createCrownElement(data: ReplaysDBObject, firstPlayerElement: HTMLElement, secondPlayerElement: HTMLElement) {
    const crownElement = createElement([ setting.classNames.replays.crown ]);
    crownElement.style.backgroundImage = `url(${setting.imgNames.crown})`;

    const winnerElement = JSON.stringify(data.firstPlayer.player) === JSON.stringify(data.winner)
    ? firstPlayerElement : secondPlayerElement;

    winnerElement.appendChild(crownElement);
  }

  private static addCrossImg(): HTMLElement {
    const crossElement = createElement([ setting.classNames.replays.cross ]);
    crossElement.style.backgroundImage = `url(${setting.imgNames.cross})`;
    return crossElement;
  }
}