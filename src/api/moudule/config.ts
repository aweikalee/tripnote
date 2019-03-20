import { ICurrencyText, IPayMode } from '@/views'
import ApiBase from './base'
import store from '@/store'

export default class extends ApiBase {
    constructor() {
        super({})
    }
    currencyText() {
        return new Promise<ICurrencyText[]>((resolve, reject) => {
            this.http.get<ICurrencyText[]>('/config/currency')
                .then((res) => {
                    store.commit('currencyText', res)
                    resolve(res)
                })
                .catch((err) => reject(err))
        })
    }
    payMode() {
        return new Promise<IPayMode[]>((resolve, reject) => {
            this.http.get<IPayMode[]>('/config/paymode')
                .then((res) => {
                    store.commit('payMode', res)
                    resolve(res)
                })
                .catch((err) => reject(err))
        })
    }
}
