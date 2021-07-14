import { createElement } from "../../shared/create-element";
import { storage } from "../data-base/data-base-element";
import { BaseComponents } from "../models/base-component";
import { Replay } from "../replay/replay";
import { setting } from "../settings/setting";
import './replays.css';

export class Replays extends BaseComponents {
  private readonly container: HTMLElement;

  private replays: Replay[] = [];

  constructor() {
    super('section', [ setting.classNames.replays.replays ]);

    this.container = createElement([ setting.classNames.replays.replaysContainer ]);
    this.element.appendChild(this.container);

    this.replaysInit();
  }

  private async replaysInit() {
    const replaysData = await storage.getReplays();
    this.replays = replaysData.map((data) => new Replay(data));
    this.replays.forEach((replay) => {
      this.container.appendChild(replay.element);
    });
  }
}