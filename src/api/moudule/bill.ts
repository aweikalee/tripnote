import { IBill } from '@/views'
import ApiBase from './base'
import db from '@/api/indexeddb/bill'

export default class extends ApiBase {
    constructor() {
        super({
            create_time: 'UTC|timestamp',
            update_time: 'timestamp',
            payer: 'array',
            participant: 'array',
            balance: 'array',
        })
    }
    read(id: number, local = false) {
        const request = local
            ? db.read(id)
            : this.http.get<IBill>(`/bill/${id}`)
        return new Promise<IBill>((resolve, reject) => {
            request
                .then((res) => {
                    res = this.adapt<IBill>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    async lists(pid: number, local = false, loading = false) {
        let request: Promise<IBill[]>
        let lastUpdate: IBill | void
        let timestamp: number
        if (local) {
            request = db.lists(pid)
        } else {
            lastUpdate = await db.lastUpdate(pid)
            timestamp = lastUpdate ? lastUpdate.update_time : -1
            request = this.http.get<IBill[]>(`/bill`, {
                params: {
                    pid,
                    timestamp,
                },
                loading,
            })
        }
        return new Promise<IBill[]>((resolve, reject) => {
            request
                .then((res) => {
                    let dbRequest: Array<Promise<{}>> = []
                    if (!local && res) {
                        dbRequest = res.map((item) => {
                            if ('payer' in item) {
                                item.payer.sort()
                            }
                            if ('participant' in item) {
                                item.participant.sort()
                            }
                            return db.update(item)
                        }) as any
                    }
                    Promise.all(dbRequest)
                        .then(() => {
                            res = res
                                ? res.filter((item) => !item.deletedAt)
                                : res
                            res = this.adapt<IBill[]>(res, true)
                            resolve(res)
                        })
                        .catch((e) => reject(e))
                })
                .catch((e) => reject(e))
        })
    }
    create(data: IBill, loading = false, local = false) {
        data = this.adapt<IBill>(data)
        if (local) {
            return db.create(data)
        } else {
            return this.http.post(`/bill`, data, {
                loading,
            })
        }
    }
    update(data: IBill, loading = false, local = false) {
        data = this.adapt<IBill>(data)
        if (local) {
            return db.update(data)
        } else {
            return this.http.put(`/bill`, data, {
                loading,
            })
        }
    }
    createLists(data: IBill[], loading = false, local = false) {
        data = this.adapt<IBill[]>(data)
        return this.http.post(
            `/bill/batch`,
            {
                bill: data,
            },
            {
                loading,
            }
        )
    }
    delete(id: number, loading = false, local = false) {
        if (local) {
            return db.delete(id)
        } else {
            return new Promise((reslove, reject) => {
                this.http
                    .delete(`/bill/${id}`, {
                        loading,
                    })
                    .then(() => {
                        db.delete(id)
                            .then(() => reslove(null))
                            .catch((err) => reject(err))
                    })
                    .catch((err) => reject(err))
            })
        }
    }
    async count(pid: number, loading = false, local = false) {
        let lastUpdate: IBill | void
        let timestamp: number
        if (local) {
            return db.count(pid)
        } else {
            lastUpdate = await db.lastUpdate(pid)
            timestamp = lastUpdate ? lastUpdate.update_time : -1
            return this.http.get<number>(`/bill/count`, {
                params: {
                    pid,
                    timestamp,
                },
                loading,
            })
        }
    }
    lastUpdate(pid: number) {
        return new Promise<number>((resolve, reject) => {
            db.lastUpdate(pid)
                .then((res) => {
                    if (res) {
                        resolve(res.update_time * 1000)
                    } else {
                        resolve(-1)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    clear(pid: number) {
        return db.clear(pid)
    }
}
