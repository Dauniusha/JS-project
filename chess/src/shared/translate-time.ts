export const timeFunctions = {
  getStringTime(time: number):string {
    const minute = Math.floor(time / 60);
    const second = time % 60;

    const stringMinute = minute < 10 ? `0${minute}` : String(minute);
    const stringSecond = second < 10 ? `0${second}` : String(second);

    return `${stringMinute}:${stringSecond}`;
  },

  getNumberTime(time: string): number {
    const [minute, second] = time.split(':');
    return Number(second) + Number(minute) * 60;
  },
};
