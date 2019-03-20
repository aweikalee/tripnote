import { ICurrency } from './../views/index.d'
import { Store, GetterTree, Getter } from 'vuex'
// import { Route } from 'vue-router'
import { getItem, setItem, setState } from './method'
import { IState } from './state'
import { ICurrencyText, IPayMode, IConsumptionType, IPartner } from '@/views'

export interface IGetters<S, R> extends GetterTree<S, R> {
    getCurrencyText: (state: S) => (name: string) => string
    getCurrencyTexts: (
        state: S
    ) => (
        target: Array<ICurrency | ICurrencyText | string>,
        needCNY: boolean
    ) => ICurrencyText[]
    getCurrencyRate: (state: S) => (name: string) => number
    getPayMode: (state: S) => (name: string) => string
    getPayModes: (state: S) => (names: string[]) => IPayMode[]
    getConsumptionType: (state: S) => (name: string) => IConsumptionType
    getPartnerNickname: (state: S) => (id: number) => string
}

const getters: IGetters<IState, IState> = {
    getCurrencyText: (state) => (name) => {
        const finded = state.currencyText.find((item: ICurrencyText) => {
            return item.name === name
        })
        return finded ? finded.text : name
    },
    getCurrencyTexts: (state) => (target = [], needCNY = false) => {
        const names = target
            .map((item) => {
                return typeof item === 'string' ? item : item.name
            })
            .filter((item) => {
                return item === 'CNY' ? needCNY : item
            })
        if (needCNY && !names.includes('CNY')) {
            names.push('CNY')
        }
        return names.map((name) => {
            const finded = state.currencyText.find((item: IPayMode) => {
                return item.name === name
            })
            return finded
                ? finded
                : {
                      id: 0,
                      text: name,
                      name
                  }
        })
    },
    getCurrencyRate: (state) => (name) => {
        const finded = state.itinerary.currency.find((item: ICurrency) => {
            return item.name === name
        })
        return finded ? finded.rate : 1
    },
    getPayMode: (state) => (name) => {
        const finded = state.payMode.find((item: IPayMode) => {
            return item.name === name
        })
        return finded ? finded.text : name
    },
    getPayModes: (state) => (names) => {
        return names.map((name) => {
            const finded = state.payMode.find((item: IPayMode) => {
                return item.name === name
            })
            return finded
                ? finded
                : {
                      id: 0,
                      text: name,
                      name
                  }
        })
    },
    getConsumptionType: (state) => (name) => {
        const result = state.consumptionType.find((item: IConsumptionType) => {
            return item.name === name || item.name === 'other'
        })
        return result!
    },
    getPartnerNickname: (state) => (id) => {
        const result = (state.itinerary.partner || []).find(
            (item: IPartner) => {
                return item.id === id
            }
        )
        return result ? result.nickname : `${id}`
    }
}
export default getters
