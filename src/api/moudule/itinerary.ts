import { IPosition, IItinerary } from '@/views'
import ApiBase from './base'
import store from '@/store'

export default class extends ApiBase {
    constructor() {
        super({
            start_time: 'UTC|timestamp',
            pay_mode: 'array',
            partner: 'array',
            currency: 'array'
        })
    }
    read(id: number) {
        return new Promise<IItinerary>((resolve, reject) => {
            if (store.state.itinerary.id !== id) {
                this.http
                    .get<IItinerary>(`/itinerary/${id}`)
                    .then((res) => {
                        res = this.adapt<IItinerary>(res, true)
                        store.commit('itinerary', res)
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } else {
                resolve(store.state.itinerary)
            }
        })
    }
    lists(page: number) {
        return new Promise<IItinerary[]>((resolve, reject) => {
            this.http
                .get<IItinerary[]>(`/itinerary`, {
                    params: {
                        page
                    }
                })
                .then((res) => {
                    res = this.adapt<IItinerary[]>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    create(data: IItinerary, loading = false) {
        data = this.adapt<IItinerary>(data)
        return this.http.post(`/itinerary`, data, {
            loading
        })
    }
    update(data: IItinerary, loading = false) {
        data = this.adapt<IItinerary>(data)
        return this.http.put(`/itinerary`, data, {
            loading
        })
    }
    delete(id: number, loading = false) {
        return this.http.delete(`/itinerary/${id}`, {
            loading
        })
    }
}
