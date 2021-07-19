export class MessageReader {
  static writeMessage(startCell: string, endCell: string): string {
    return startCell + ' ' + endCell;
  }

  static readMessage(message: string): string[] {
    return message.split(' ');
  }
}