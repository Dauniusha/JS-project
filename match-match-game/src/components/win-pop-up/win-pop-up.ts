import { Popup } from '../pop-up/popup-component';
import './win-pop-up.css';

export class WinPopup extends Popup {
  okBtn: HTMLAnchorElement;

  constructor(time: number) {
    super();
    if (Math.floor(time / 60)) {
      this.popUp.element.innerHTML = `
        <p class='congratulations'>Congratulations! You successfully found all matches on ${Math.floor(
    time / 60,
  )} minutes and ${time % 60} seconds.</p>
      `;
    } else {
      this.popUp.element.innerHTML = `
        <p class='congratulations'>Congratulations! You successfully found all matches on ${time % 60} seconds.</p>
      `;
    }
    this.okBtn = document.createElement('a');
    this.okBtn.innerHTML = 'ok';
    this.okBtn.classList.add('win-popup-btn');
    this.okBtn.href = '#/Scores';
    this.popUp.element.appendChild(this.okBtn);
  }

  showWinPopup() {
    this.showPopup();
    this.okBtn.addEventListener('click', () => {
      this.closePopup();
    });
  }
}
