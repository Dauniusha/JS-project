import { BaseComponents } from "../models/base-component";
import { setting } from "../settings/setting";

export class Player extends BaseComponents {
  private readonly avatar: HTMLInputElement;

  private readonly name: HTMLInputElement;

  constructor(initValue: string) {
    super('div', [setting.classNames.player.player]);

    this.avatar = this.avatarInit();

    this.name = this.nameInit(initValue);
  }

  private nameInit(initValue: string): HTMLInputElement { // TODO: загрузку имени с DB
    const name = document.createElement('input');
    name.classList.add(setting.classNames.player.name);
    name.type = 'text';
    name.value = initValue;
    this.element.appendChild(name);
    return name;
  }

  private avatarInit(): HTMLInputElement { // TODO: загрузку картинки с DB
    const avatar = document.createElement('input');
    avatar.classList.add(setting.classNames.player.avatar);
    this.element.appendChild(avatar);
    return avatar
  }
}