import { BaseComponents } from "../models/base-component";
import { setting } from "../settings/setting";

export class Player extends BaseComponents {
  private readonly avatar: HTMLInputElement | HTMLElement;

  private readonly name: HTMLInputElement;

  private avatarURL?: string;

  constructor(initValue: string, writable: boolean) {
    super('div', [setting.classNames.player.player]);

    this.avatar = writable ? this.avatarInit() : this.avatarImg();

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
    avatar.type = 'file';
    avatar.classList.add(setting.classNames.player.avatar);
    this.element.appendChild(avatar);
    this.upload(avatar);
    return avatar
  }

  private avatarImg(): HTMLElement {
    const avatar = document.createElement('div');
    avatar.classList.add(setting.classNames.player.gameAvatar);
    this.element.appendChild(avatar);
    return avatar;
  }

  private upload(avatarElement: HTMLInputElement) {
    avatarElement.addEventListener('change', () => {
      const reader = new FileReader();;
      if (!avatarElement.files) {
        throw Error('Files for avatar does not exist!');
      }
      const file = avatarElement.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatarURL = <string>reader.result;
        avatarElement.style.background = `url(${<string>reader.result}) center no-repeat`;
        avatarElement.style.backgroundSize = 'cover';
      };
    });
  }

  getName(): string {
    return this.name.value;
  }
}