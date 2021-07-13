import { storage } from "../data-base/data-base-element";
import { BaseComponents } from "../models/base-component";
import { PlayerDBObject } from "../models/data-base/data-base-player-object";
import { setting } from "../settings/setting";

export class Player extends BaseComponents {
  private avatar: HTMLInputElement | HTMLElement | undefined;

  private avatarURL: string | undefined;

  private name: string | undefined;

  constructor(writable: boolean, counter: number) {
    super('div', [setting.classNames.player.player]);

    writable ? this.playerInit(counter) : this.getPlayer(counter);
  }

  private async playerInit(counter: number) {
    const players = await storage.getPlayers();
    [ this.avatarURL, this.name ] = players[counter] ? 
    [ players[counter].avatarURL, players[counter].name ] : 
    [ setting.playersInitStates.playerImgURL, setting.playersInitStates.players[counter] ];
    
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
    this.element.appendChild(nameElement);
    this.input(nameElement);
  }

  private async getPlayer(counter: number) {
    const players = await storage.getPlayers();
    [ this.avatarURL, this.name ] = players[counter] ? 
    [ players[counter].avatarURL, players[counter].name ] : 
    [ setting.playersInitStates.playerImgURL, setting.playersInitStates.players[counter] ];

    const avatar = document.createElement('div');
    avatar.classList.add(setting.classNames.player.gameAvatar);
    if (this.avatarURL !== setting.playersInitStates.playerImgURL) {
      avatar.style.backgroundImage = `url(${this.avatarURL})`;
    } else {
      avatar.innerHTML = this.name[0];
    }
    this.avatar = avatar;
    this.element.appendChild(avatar);

    const nameElement = document.createElement('div');
    nameElement.classList.add(setting.classNames.player.name);
    nameElement.innerHTML = this.name;
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
    } else {
      throw new Error('Name does not exist!');
    }
  }

  getNameWithAvatar(): PlayerDBObject {
    if (this.avatarURL && this.name) {
      return { avatarURL: this.avatarURL, name: this.name };
    } else {
      throw new Error('Name or avatar does not exist!');
    }
  }

  getAvatar(): HTMLInputElement | HTMLElement {
    if (this.avatar) {
      return this.avatar;
    }
    throw new Error('Avatar does not exist!');
  }
}