import { PlayerWithMove } from "../models/data-base/data-base-player-move";
import { PlayerDBObject } from "../models/data-base/data-base-player-object";
import { ReplaysDBObject } from "../models/data-base/data-base-replays-object";
import { setting } from "../settings/setting";

export class DataBase {
  private dataBase: IDBDatabase | undefined;

  createDataBase(): Promise<void> {
    return new Promise((resolve) => {
      const openRequest = indexedDB.open('Chess', setting.dataBase.version);
      openRequest.onupgradeneeded = () => {
        this.dataBase = openRequest.result;
        /* switch(this.dataBase.version) {
          case 0;
        } */
        this.dataBase.createObjectStore(setting.dataBase.storeUserName, { keyPath: 'counter' });
        this.dataBase.createObjectStore(setting.dataBase.storeGamesName, { autoIncrement: true });
      };

      openRequest.onsuccess = () => {
        this.dataBase = openRequest.result;
        resolve();
      };

      openRequest.onerror = () => {
        throw Error('Error opening database!');
      };
    });
  }

  addPlayer(player: PlayerDBObject, counter: number) {
    const transaction = this.dataBase?.transaction([ setting.dataBase.storeUserName ], 'readwrite');
    if (!transaction) {
      throw Error('Data base not exist!');
    }
    const store = transaction.objectStore(setting.dataBase.storeUserName);

    const playerDB = {
      player,
      counter,
    }
    store.put(playerDB);

    transaction.oncomplete = () => {
      console.log('Player saved!');
    };

    transaction.onerror = () => {
      console.log('Error storing player!');
    };
  }

  getPlayers(): Promise<PlayerDBObject[]> {
    return new Promise((resolve) => {
      const transaction = this.dataBase?.transaction([ setting.dataBase.storeUserName ], 'readonly');
      if (!transaction) {
        throw Error('Data base not exist!');
      }
      const store = transaction.objectStore(setting.dataBase.storeUserName);
      const request = store.openCursor();
      const players: PlayerDBObject[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          players.push(cursor.value.player);
          cursor.continue();
        } else {
          resolve(players);
        }
      }

      request.onerror = () => {
        throw Error('Error with cursor request!');
      };
    });
  }

  addReplay(firstPlayer: PlayerWithMove, secondPlayer: PlayerWithMove, winner: PlayerDBObject) {
    const transaction = this.dataBase?.transaction([ setting.dataBase.storeGamesName ], 'readwrite');
    if (!transaction) {
      throw Error('Data base not exist!');
    }
    const store = transaction.objectStore(setting.dataBase.storeGamesName);

    const replay: ReplaysDBObject = {
      firstPlayer,
      secondPlayer,
      winner,
    }
    store.put(replay);

    transaction.oncomplete = () => {
      console.log('Replay saved!');
    };

    transaction.onerror = () => {
      console.log('Error storing replay!');
    };
  }

  getReplays(): Promise<ReplaysDBObject[]> {
    return new Promise((resolve) => {
      const transaction = this.dataBase?.transaction([ setting.dataBase.storeGamesName ], 'readonly');
      if (!transaction) {
        throw Error('Data base not exist!');
      }
      const store = transaction.objectStore(setting.dataBase.storeGamesName);
      const request = store.openCursor();
      const replays: ReplaysDBObject[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          replays.push(cursor.value.player);
          cursor.continue();
        } else {
          resolve(replays);
        }
      }

      request.onerror = () => {
        throw Error('Error with cursor request!');
      };
    });
  }
}