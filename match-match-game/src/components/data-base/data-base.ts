import { setting } from '../setting-object/setting-object';
import { DBObject } from './DB-object-interface';

const VERSION = 1;
const STORE_NAME = 'players';
const STORE_USER_NAME = 'user-setting';
const USER_NUMBER = 0;

export class DataBase {
  private dataBase: IDBDatabase | undefined;

  user?: DBObject;

  createDataBase(): Promise<void> {
    return new Promise((resolve) => {
      const openRequest = indexedDB.open('dauniusha', VERSION);
      openRequest.onupgradeneeded = () => {
        this.dataBase = openRequest.result;
        /* switch(this.dataBase.version) {
          case 0;
        } */
        this.dataBase.createObjectStore(STORE_NAME, { keyPath: 'id' });
        this.dataBase.createObjectStore(STORE_USER_NAME, { keyPath: 'number' });
        this.user = {
          firstName: '',
          lastName: '',
          mail: '',
          id: 0,
          score: 0,
        };
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

  addPlayer(player: DBObject) {
    const transaction = this.dataBase?.transaction([STORE_NAME], 'readwrite');
    if (!transaction) {
      throw Error('Data base not exist!');
    }
    const store = transaction.objectStore(STORE_NAME);
    store.put(player);

    transaction.oncomplete = () => {
      console.log('Player saved!');
    };

    transaction.onerror = () => {
      console.log('Error storing player!');
    };
  }

  getPlayers(): Promise<DBObject[]> {
    return new Promise((resolve) => {
      const transaction = this.dataBase?.transaction([STORE_NAME], 'readonly');
      if (!transaction) {
        throw Error('Data base not exist!');
      }
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();
      const players: DBObject[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          players.push(cursor.value);
          cursor.continue(); // Вызывается снова событие onsuccess
          // Ругается линт
        } else {
          // То есть все значения пройдены
          return resolve(players);
        }
      };

      request.onerror = () => {
        throw Error('Error with cursor request!');
      };
    });
  }

  addUserAndSetting() {
    const transaction = this.dataBase?.transaction([STORE_USER_NAME], 'readwrite');
    if (!transaction) {
      throw Error('Data base not exist!');
    }
    const store = transaction.objectStore(STORE_USER_NAME);
    const user = {
      user: this.user,
      setting,
      number: USER_NUMBER,
    };
    store.put(user);

    transaction.oncomplete = () => {
      console.log('User-setting saved!');
    };

    transaction.onerror = () => {
      console.log('Error storing user-seetting!');
    };
  }

  getUserAndSetting(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.dataBase?.transaction([STORE_USER_NAME], 'readonly');
      if (!transaction) {
        throw Error('Data base not exist!');
      }
      const store = transaction.objectStore(STORE_USER_NAME);
      const request = store.get(USER_NUMBER);

      request.onsuccess = () => {
        if (request.result) {
          setting.amountPairs = request.result.setting.amountPairs;
          setting.category = request.result.setting.category;
          this.user = request.result.user;
          resolve();
        } else {
          reject();
        }
      };

      request.onerror = () => {
        throw Error('Error with request!');
      };
    });
  }
}
