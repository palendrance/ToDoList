export interface StoreDBPair {
  store: IDBObjectStore,
  db: IDBDatabase,
}

export interface ToDoItem {
  id: string,
  label: string,
  isComplete: boolean,
}
