import { Card } from '../src/components/play-card/play-card';

export function shuffle(cards: Card[]) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Деструктуризация
  }
}
