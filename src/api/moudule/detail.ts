import { IDetail } from '@/views'
import ApiBase from './base'

export default class extends ApiBase {
    constructor() {
        super({
            position: 'array'
        })
    }
    read(id: number) {
        return new Promise<IDetail>((resolve, reject) => {
            this.http
                .get<IDetail>(`/detail/${id}`)
                .then((res) => {
                    res = this.adapt<IDetail>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    lists(pid: number) {
        return new Promise<IDetail[]>((resolve, reject) => {
            this.http
                .get<IDetail[]>(`/detail`, {
                    params: {
                        pid
                    }
                })
                .then((res) => {
                    res = this.adapt<IDetail[]>(res, true)
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    create(data: IDetail, loading = false) {
        data = this.adapt<IDetail>(data)
        return this.http.post(`/detail`, data, {
            loading
        })
    }
    update(data: IDetail, loading = false) {
        data = this.adapt<IDetail>(data)
        return this.http.put(`/detail`, data, {
            loading
        })
    }
    delete(id: number, loading = false) {
        return this.http.delete(`/detail/${id}`, {
            loading
        })
    }
    sort(data: IDetail[], loading = false) {
        return this.http.patch(
            `/detail/sort`,
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
