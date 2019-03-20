import { IBill } from '@/views'
import baseDB from './base'

const storeName = 'bill'
export default {
    async read(id: number) {
        return (await baseDB.store(storeName)).index('id').get<IBill>(id)
    },
    async lists(pid: number) {
        return (await baseDB.store(storeName))
            .index('pid')
            .filter<IBill>(IDBKeyRange.only(pid))
    },
    async create(data: IBill) {
        return (await baseDB.store(storeName, 'readwrite')).put(data)
    },
    async update(data: IBill) {
        return (await baseDB.store(storeName, 'readwrite')).put(data)
    },
    async delete(id: number) {
        return (await baseDB.store(storeName, 'readwrite')).delete(id)
    },
    async count(pid: number) {
        return (await baseDB.store(storeName))
            .index('pid')
            .count(IDBKeyRange.only(pid))
    },
    async clear(pid: number) {
        return (await baseDB.store(storeName, 'readwrite'))
            .index('pid')
            .delete(IDBKeyRange.only(pid))
    },
    async lastUpdate(pid: number) {
        return (await baseDB.store(storeName))
            .index('pid-update_time')
            .first<IBill>(IDBKeyRange.bound([pid, 0], [pid, Infinity]), 'prev')
    }
}
