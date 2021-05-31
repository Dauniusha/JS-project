import './register-popup.css';
import { Popup } from '../pop-up/popup-component';
import { storage } from '../data-base/data-base-elem';

const START_IMG = './Unknown.png';

export class RegisterPopup extends Popup {
  private readonly firstName: HTMLInputElement;

  private readonly lastName: HTMLInputElement;

  private readonly email: HTMLInputElement;

  private readonly addBtn: HTMLElement | null;

  private readonly cancelBtn: HTMLElement | null;

  private readonly form: HTMLElement | null;

  private readonly inputAvatar: HTMLInputElement;

  private avatarURL: string = START_IMG;

  constructor() {
    super();
    this.popUp.element.innerHTML = `
      <h2 class="title register-title">Register new Player</h2>
      <form class="register-popup">
        <div class="full-data">
          <div class="user-data">
            <div class="input-container">
              <input class="input-name" id="first-name" type="text" required autocomplete="off" maxlength="30" pattern="^[A-Za-zА-Яа-яЁё0-9 ]+$" placeholder="First name">
            </div>
            <div class="input-container">
              <input class="input-name" id="last-name" type="text" required autocomplete="off" maxlength="30" pattern="^[A-Za-zА-Яа-яЁё0-9 ]+$" placeholder="Last name">
            </div>
            <div class="input-container">
              <input class="input-name" id="email" type="email" required maxlength="30" placeholder="E-mail">
            </div>
          </div>
          <input class="input-avatar" type="file">
        </div>
        <div class="register-btns">
          <button class="add-user-btns" type="submit">add user</button>
          <button class="cancel-btns">cancel</button>
        </div>
      </form>
    `;
    this.firstName = <HTMLInputElement> this.popUp.element.querySelector('#first-name'); // Потому что getById метод document, а я еще к нему не добавил popup
    this.lastName = <HTMLInputElement> this.popUp.element.querySelector('#last-name');
    this.email = <HTMLInputElement> this.popUp.element.querySelector('#email');
    this.addBtn = this.popUp.element.querySelector('.add-user-btns');
    this.form = this.popUp.element.querySelector('form');
    this.cancelBtn = this.popUp.element.querySelector('.cancel-btns');
    this.inputAvatar = <HTMLInputElement> this.popUp.element.querySelector('.input-avatar');
  }

  showRegisterPopup() {
    this.showPopup();
    this.firstName?.addEventListener('input', () => {
      RegisterPopup.nameValidation(this.firstName);
    });
    this.lastName?.addEventListener('input', () => {
      RegisterPopup.nameValidation(this.lastName);
    });
    this.email?.addEventListener('input', () => {
      if (!this.email.validity.valid && this.email.parentElement) {
        this.email.parentElement.classList.remove('valid');
        this.email.parentElement.classList.add('invalid');
      } else if (this.email.parentElement) {
        this.email.parentElement.classList.remove('invalid');
        this.email.parentElement.classList.add('valid');
      }
    });
    this.cancelBtn?.addEventListener('click', () => {
      this.cancel();
    });
    this.element.addEventListener('click', (elem) => {
      if (!(<Element>elem.target).closest('.popup__inner')) {
        this.cancel();
      }
    });
    this.upload();
  }

  private static nameValidation(name: HTMLInputElement) {
    let isFirstName = false;
    if (name.id === 'first-name') {
      isFirstName = true;
    }
    if (name.validity.valueMissing) {
      if (isFirstName) {
        name.setCustomValidity('Имя не может быть пустым.');
      } else {
        name.setCustomValidity('Фамилия не может быть пустой.');
      }
    } else if (!/[^0-9]{1,}/.test(name.value)) {
      if (isFirstName) {
        name.setCustomValidity('Имя не может состоять из цифр.');
      } else {
        name.setCustomValidity('Фамилия не может состоять из цифр.');
      }
    } else if (/^[^\s]+\s[^\s]+$/.test(name.value)) {
      if (isFirstName) {
        name.setCustomValidity('Имя не может содержать более чем одно слово.');
      } else {
        name.setCustomValidity('Фамилия не может содержать более чем одно слово.');
      }
    } else if (name.validity.patternMismatch) {
      if (isFirstName) {
        name.setCustomValidity('Имя не может содержать служебные символы.');
      } else {
        name.setCustomValidity('Фамилия не может содержать служебные символы.');
      }
    } else if (name.validity.tooLong) {
      name.setCustomValidity('Колличество символов не должно превышать 30 символов.');
    } else {
      name.setCustomValidity('');
      if (name.parentElement) {
        name.parentElement.classList.remove('invalid');
        name.parentElement.classList.add('valid');
      }
    }
    if (!name.validity.valid && name.parentElement) {
      name.parentElement.classList.remove('valid');
      name.parentElement.classList.add('invalid');
    }
  }

  cancel() {
    const inputs = [this.email, this.firstName, this.lastName];
    inputs.forEach((input) => {
      input.value = '';
      input.parentElement?.classList.remove('invalid');
      input.parentElement?.classList.remove('valid');
    });
    this.inputAvatar.style.background = `url(${START_IMG}) center no-repeat`;
    this.inputAvatar.style.backgroundSize = 'cover';
    this.closePopup();
  }

  getForm() {
    return this.form;
  }

  upload() {
    this.inputAvatar?.addEventListener('change', () => {
      const reader = new FileReader();
      if (!this.inputAvatar.files) {
        throw Error('Files for avatar does not exist!');
      }
      const file = this.inputAvatar.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatarURL = <string>reader.result;
        this.inputAvatar.style.background = `url(${<string>reader.result}) center no-repeat`;
        this.inputAvatar.style.backgroundSize = 'cover';
      };
      this.inputAvatar.value = '';
    });
  }

  private static hashCode(s: string): number {
    return s.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  getAllData() {
    const id = RegisterPopup.hashCode(this.firstName.value + this.lastName.value + this.email.value);
    storage.user = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      mail: this.email.value,
      id,
      avatarURL: this.avatarURL,
      score: 0,
    };
    storage.addPlayer(storage.user);
  }
}
