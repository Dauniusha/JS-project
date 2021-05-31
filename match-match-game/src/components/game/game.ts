import { CardsField } from '../cards-field/cards-field';
import { storage } from '../data-base/data-base-elem';
import { delay } from '../delay/delay';
import { ImgCategory } from '../models/img-category';
import { Card } from '../play-card/play-card';
import { setting } from '../setting-object/setting-object';
import { shuffle } from '../shuffle';
import { Timer } from '../timer/timer';
import { WinPopup } from '../win-pop-up/win-pop-up';

const DELAY_SUCCESS_TIME = 1;
const DELAY_MISTAKE_TIME = 0.2;

export class Game {
  private cardsField: CardsField;

  private activeCard?: Card;

  timer: Timer;

  private isMove = false;

  private closeCardPair = setting.amountPairs;

  private winPopup?: WinPopup;

  private gameIsActive = false;

  constructor() {
    this.cardsField = new CardsField();
    this.timer = new Timer();
  }

  getCardsField() {
    // Пока не нужна, можно будет удалить
    if (this.cardsField !== undefined) {
      return this.cardsField;
    }
    throw Error('Cards field does not exist!');
  }

  async createGame(imagesURL: string[]) {
    this.cardsField.clear();
    this.gameIsActive = true;

    const cards = imagesURL.concat(imagesURL).map((imageURL) => new Card(imageURL));
    shuffle(cards);

    cards.forEach((card) => {
      card.element.addEventListener('click', () => this.cardHandler(card));
    });

    await this.cardsField.addCard(cards);
    this.timer.startTimer();
  }

  private async cardHandler(card: Card) {
    if (this.isMove || !this.timer.getTimer()) {
      return;
    }
    this.isMove = true;
    card.flip();
    if (!this.activeCard) {
      this.activeCard = card;
      this.isMove = false;
      return;
    }
    if (this.activeCard.image !== card.image) {
      await delay(DELAY_MISTAKE_TIME);
      await Promise.all([card.mistake(), this.activeCard.mistake()]);
      card.flip();
      this.activeCard.flip();
    } else {
      card.success();
      this.activeCard.success();
      this.closeCardPair--;
      if (!this.closeCardPair) {
        this.timer.stopTimer();
        await delay(DELAY_SUCCESS_TIME); // Чтобы последняя пара подсветилась зеленым
        this.endGame();
      }
    }

    this.activeCard = undefined;
    this.isMove = false;
  }

  private async preStart() {
    const res = await fetch('./images.json');
    const imagesCategories: ImgCategory[] = await res.json();
    let playCategory: ImgCategory = imagesCategories[0];
    imagesCategories.forEach((category) => {
      if (category.categoryName === setting.category) {
        playCategory = category;
      }
    });
    const images = playCategory.imagesURL
      .map((url) => `${playCategory.categoryName}/${url}`)
      .sort(() => Math.random() - 0.5);
    images.length = setting.amountPairs;
    this.createGame(images);
  }

  start(rootElement: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      rootElement.appendChild(this.timer.element);
      rootElement.appendChild(this.cardsField.element);
      this.preStart();
      resolve();
    });
  }

  private endGame() {
    this.gameIsActive = false;
    let score = setting.amountPairs * 100 - this.timer.getTimeNow() * 10;
    if (score < 0) {
      score = 0;
    }
    if (storage.user) {
      storage.user.score = score;
    } else {
      throw Error('User does not create!');
    }
    storage.addPlayer(storage.user);
    this.winPopup = new WinPopup(this.timer.getTimeNow());
    document.body.appendChild(this.winPopup.element);
    this.winPopup.showWinPopup();
  }
}
