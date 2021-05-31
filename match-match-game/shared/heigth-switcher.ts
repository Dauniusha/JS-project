export function switcher(cardPairs: number): string {
  switch (cardPairs) {
    case 8:
      return '22vh';
    case 18:
      return '15vh';
    default:
      throw Error('This type of game is not found!');
  }
}
