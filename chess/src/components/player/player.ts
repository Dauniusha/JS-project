import { storage } from '../data-base/data-base-element';
import { BaseComponents } from '../models/base-component';
import { PlayerDBObject } from '../models/data-base/data-base-player-object';
import { setting } from '../settings/setting';

export class Player extends BaseComponents {
  private avatar?: HTMLInputElement | HTMLElement;

  private nameElement?: HTMLInputElement | HTMLElement;

  private avatarURL?: string;

  private name?: string;

  constructor(casual?: { writable: boolean, counter: number }, replay?: { avatarURL: string, name: string }) {
    super('div', [setting.classNames.player.player]);

    if (casual) {
      if (casual.writable) {
        this.playerInit(casual.counter);
      } else {
        this.getPlayer(casual.counter);
      }
    } else if (replay) {
      this.createClearPlayer(replay.avatarURL, replay.name);
    }
  }

  private async playerInit(counter: number) {
    const players = await storage.getPlayers();
    [this.avatarURL, this.name] = players[counter]
      ? [players[counter].avatarURL, players[counter].name]
      : [setting.playersInitStates.playerImgURL, setting.playersInitStates.players[counter]];

    const avatar = document.createElement('input');
    avatar.type = 'file';
    avatar.classList.add(setting.classNames.player.avatar);
    avatar.style.backgroundImage = `url(${this.avatarURL})`;
    this.avatar = avatar;
    this.element.appendChild(avatar);
    this.upload(avatar);

    const nameElement = document.createElement('input');
    nameElement.classList.add(setting.classNames.player.name);
    nameElement.type = 'text';
    nameElement.value = this.name;
    this.nameElement = nameElement;
    this.element.appendChild(nameElement);
    this.input(nameElement);
  }

  private async getPlayer(counter: number) {
    const players = await storage.getPlayers();
    [this.avatarURL, this.name] = players[counter]
      ? [players[counter].avatarURL, players[counter].name]
      : [setting.playersInitStates.playerImgURL, setting.playersInitStates.players[counter]];

    this.createClearPlayer(this.avatarURL, this.name);
  }

  private createClearPlayer(avatarURL: string, name: string) {
    const avatar = document.createElement('div');
    avatar.classList.add(setting.classNames.player.gameAvatar);
    if (avatarURL !== setting.playersInitStates.playerImgURL) {
      avatar.style.backgroundImage = `url(${avatarURL})`;
    } else {
      avatar.innerHTML = name[0];
    }
    this.avatar = avatar;
    this.element.appendChild(avatar);

    const nameElement = document.createElement('div');
    nameElement.classList.add(setting.classNames.player.name);
    nameElement.innerHTML = name;
    this.nameElement = nameElement;
    this.element.appendChild(nameElement);
  }

  private upload(avatarElement: HTMLInputElement) {
    avatarElement.addEventListener('change', () => {
      const reader = new FileReader();
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

  private input(nameElement: HTMLInputElement) {
    nameElement.addEventListener('input', () => {
      this.name = nameElement.value;
    });
  }

  getName(): string {
    if (this.name) {
      return this.name;
    }
    throw new Error('Name does not exist!');
  }

  getNameElement(): HTMLInputElement | HTMLElement {
    if (this.nameElement) {
      return this.nameElement;
    }
    throw new Error('Name element does not exist!');
  }

  getNameWithAvatar(): PlayerDBObject {
    if (this.avatarURL && this.name) {
      return { avatarURL: this.avatarURL, name: this.name };
    }
    throw new Error('Name or avatar does not exist!');
  }

  getAvatar(): HTMLInputElement | HTMLElement {
    if (this.avatar) {
      return this.avatar;
    }
    throw new Error('Avatar does not exist!');
  }

  getAvatarURL(): string {
    if (this.avatarURL) {
      return this.avatarURL;
    }
    throw new Error('Avatar URL does not exist!');
  }

  setAvatar(avatar: string) {
    this.avatarURL = avatar;
    if (this.avatar) {
      this.avatar.style.backgroundImage = `url(${avatar})`;
    }
  }

  setName(name: string) {
    this.name = name;
    if (this.nameElement) {
      if (this.nameElement instanceof HTMLInputElement) {
        this.nameElement.value = name;
      } else {
        this.nameElement.innerHTML = name;
      }
    }
  }
}
