import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import { v4 as uuid } from 'uuid';
import {StoreDBPair, ToDoItem} from '../interfaces/to-do';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {

  constructor() { }

  initializeToDoDB(): void {
    const req: IDBOpenDBRequest = window.indexedDB.open('ToDoListDB', 1);

    req.onsuccess = (_event) => {
      const db = req.result;

      db.close();
    }

    req.onupgradeneeded = (_event) => {
      const db = req.result;

      db.createObjectStore('ToDoItems', {keyPath: 'id'});

      db.close();
    };
  }

  getToDoStore(): Observable<StoreDBPair> {
    return new Observable<StoreDBPair>(observer => {
      const req: IDBOpenDBRequest = window.indexedDB.open('ToDoListDB', 1);

      req.onsuccess = () => {
        const db: IDBDatabase = req.result;

        const store = req.result.transaction(['ToDoItems'], 'readwrite').objectStore('ToDoItems');
        observer.next({db: db, store: store});
        observer.complete();
      }
    });
  }

  closeToDoStore(observer: Observer<any>, db: IDBDatabase, result: any): void {
    observer.next(result);
    observer.complete();
    db.close();
  }

  getItems(): Observable<ToDoItem[]> {
    return new Observable(observer => {
      this.getToDoStore().subscribe(({db, store}: StoreDBPair) => {
        const req = store.getAll();

        req.onsuccess = () => {
          this.closeToDoStore(observer, db, req.result);
        };
      });
    });
  }

  getItem(id: string): Observable<ToDoItem> {
    return new Observable(observer => {
      this.getToDoStore().subscribe(({db, store}: StoreDBPair) => {
        const req = store.get(id);

        req.onsuccess = () => {
          this.closeToDoStore(observer, db, req.result);
        };
      });
    });
  }

  setItem(item: ToDoItem): Observable<any> {
    if (!item.id) {
      item.id = uuid();
    }

    return new Observable(observer => {
      this.getToDoStore().subscribe(({db, store}: StoreDBPair) => {
        const req = store.put(item);

        req.onsuccess = () => {
          this.closeToDoStore(observer, db, req.result);
        };
      });
    });
  }

  deleteItem(id: string): Observable<boolean> {
    return new Observable(observer => {
      this.getToDoStore().subscribe(({db, store}: StoreDBPair) => {
        const req = store.delete(id);

        req.onsuccess = () => {
          this.closeToDoStore(observer, db, true);
          observer.complete();
        };
      });
    });
  }
}
