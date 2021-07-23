import { color } from '../components/models/game/color-interface';

export const colorFunctions = {
  getReverseColor(movedPieceColor: string): string {
    return movedPieceColor === color.white ? color.black : color.white;
  },

  getRandomColor() {
    return Math.random() > 0.5 ? color.black : color.white;
  },
};
