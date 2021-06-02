import './timer.css';
import { BaseComponents } from '../models/base-conponents';

export class Timer extends BaseComponents {
  private timer?: NodeJS.Timeout;

  private timeNow = 0;

  private minute: BaseComponents;

  private second: BaseComponents;

  constructor() {
    super('div', ['timer']);
    this.minute = new BaseComponents('label', ['timer__inner']);
    this.element.appendChild(this.minute.element);
    const colon = new BaseComponents('div', ['timer__colon']);
    colon.element.innerHTML = ':';
    this.element.appendChild(colon.element);
    this.second = new BaseComponents('label', ['timer__inner']);
    this.element.appendChild(this.second.element);
    this.showTime();
    console.log('con');
  }

  private showTime(minute = 0, second = 0) {
    if (minute < 10) {
      this.minute.element.innerHTML = `0${minute}`;
    } else {
      this.minute.element.innerHTML = `${minute}`;
    }
    if (second < 10) {
      this.second.element.innerHTML = `0${second}`;
    } else {
      this.second.element.innerHTML = `${second}`;
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeNow++;
      this.showTime(Math.floor(this.timeNow / 60), this.timeNow % 60);
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    } else {
      this.startTimer();
    }
  }

  getTimeNow(): number {
    return this.timeNow;
  }

  getTimer(): NodeJS.Timeout | undefined {
    return this.timer;
  }
}
