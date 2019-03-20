import { IBill } from '@/views'
import ApiBase from './base'
import db from '@/api/indexeddb/billDraft'

export default class extends ApiBase {
    constructor() {
        super({
            create_time: 'UTC|timestamp',
            update_time: 'timestamp',
            payer: 'array',
            participant: 'array',
            balance: 'array'
        })
    }
    read(id: number) {
        return new Promise<IBill>((resolve, reject) => {
            db.read(id)
                .then((res) => {
                    res = this.adapt<IBill>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    lists(pid: number) {
        return new Promise<IBill[]>((resolve, reject) => {
            db.lists(pid)
                .then((res) => {
                    res = this.adapt<IBill[]>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    create(data: IBill, loading = false) {
        data = this.adapt<IBill>(
            Object.assign({}, data, {
                create_time: new Date().getTime(),
                update_time: new Date().getTime()
            })
        )
        return db.create(data)
    }
    update(data: IBill, loading = false) {
        data = this.adapt<IBill>(data)
        return db.update(data)
    }
    delete(id: number, loading = false) {
        return db.delete(id)
    }
    count(pid: number, loading = false) {
        return db.count(pid)
    }
    clear(pid: number, loading = false) {
        return db.clear(pid)
    }
}
