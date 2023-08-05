import IndexedDB from './indexeddb/index'
const baseDB = new IndexedDB({
    name: import.meta.env.VITE_FILE_SELF
})
baseDB.upgradeDB(1, (db, request, e) => {
    const bill = db.createObjectStore('bill', {
        keyPath: 'id'
    })
    bill.createIndex('id', 'id')
    bill.createIndex('pid', 'pid')
    bill.createIndex('pid-update_time', ['pid', 'update_time'])
    const billDraft = db.createObjectStore('billDraft', {
        keyPath: 'id',
        autoIncrement: true
    })
    billDraft.createIndex('id', 'id')
    billDraft.createIndex('pid', 'pid')
})

export default baseDB
