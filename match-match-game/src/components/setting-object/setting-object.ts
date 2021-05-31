class SettingObject {
  category: string;

  amountPairs: number;

  constructor(category: string, amountPairs: number) {
    this.category = category;
    this.amountPairs = amountPairs;
  }
}

export const setting = new SettingObject('space', 8);
