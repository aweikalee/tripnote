import { IPosition, ISchedule } from '@/views'
import ApiBase from './base'
import store from '@/store'

export default class extends ApiBase {
    constructor() {
        super({
            tag: 'array'
        })
    }
    read(id: number) {
        return new Promise<ISchedule>((resolve, reject) => {
            if (store.state.schedule.id !== id) {
                this.http
                    .get<ISchedule>(`/schedule/${id}`)
                    .then((res) => {
                        res = this.adapt<ISchedule>(res, true)
                        store.commit('schedule', res)
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } else {
                resolve(store.state.schedule)
            }
        })
    }
    lists(pid: number) {
        return new Promise<ISchedule[]>((resolve, reject) => {
            this.http
                .get<ISchedule[]>(`/schedule`, {
                    params: {
                        pid
                    }
                })
                .then((res) => {
                    res = this.adapt<ISchedule[]>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    create(data: ISchedule, loading = false) {
        data = this.adapt<ISchedule>(data)
        return this.http.post(`/schedule`, data, {
            loading
        })
    }
    update(data: ISchedule, loading = false) {
        data = this.adapt<ISchedule>(data)
        return this.http.put(`/schedule`, data, {
            loading
        })
    }
    delete(id: number, loading = false) {
        return this.http.delete(`/schedule/${id}`, {
            loading
        })
    }
    sort(data: ISchedule[], loading = false) {
        return this.http.patch(
            `/schedule/sort`,
            data.map((item) => {
                return {
                    id: item.id,
                    sort: item.sort
                }
            }),
            {
                loading
            }
        )
    }
}
