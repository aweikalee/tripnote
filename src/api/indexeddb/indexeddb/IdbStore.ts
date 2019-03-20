import IdbIndex from './IdbIndex'

export default class IdbStore {
    protected store: IDBObjectStore
    constructor(store: IDBObjectStore) {
        this.store = store
    }
    index(indexName: string) {
        return new IdbIndex(this.store.index(indexName), this.store)
    }
    add<T>(value: T) {
        return new Promise((resolve, reject) => {
            const request = this.store.add(value)
            request.onsuccess = () => resolve()
            request.onerror = (e) => reject(e)
        })
    }
    put<T>(value: T) {
        return new Promise((resolve, reject) => {
            const request = this.store.put(value)
            request.onsuccess = () => resolve()
            request.onerror = (e) => reject(e)
        })
    }
    putLists<T>(lists: T[]) {
        const queue = lists.map((value) => this.put(value))
        return Promise.all(queue)
    }
    delete(key: string | number | IDBKeyRange) {
        return new Promise((resolve, reject) => {
            const request = this.store.delete(key)
            request.onsuccess = () => resolve()
            request.onerror = (e) => reject(e)
        })
    }
}
