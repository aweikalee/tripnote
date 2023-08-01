/*
 * state，分为localState和normalState，区别是保存于localStorage和内存
 */
import { getItem } from './method'
import {
    IItinerary,
    ISchedule,
    ICurrencyText,
    IPayMode,
    IConsumptionType
} from '@/views'

/* 保存在localStorage的属性 */
export interface ILocalState {
    lastRoute: string
    // TODO: 表单的草稿箱
    drafts: Array<{
        name: string
        time: number
        value: any
    }>
    token: string
    username: string
    nickname: string
    loggedin: boolean
    detailSpread: boolean
}
export const localState: ILocalState = {
    lastRoute: '', // 记录用户最后浏览的页面 用于PWA打开时能直接打开该页（允许记录的页面有[/, /itinerary/:id, /schedule/:id, /bill/:pid]）
    drafts: [],
    token: '',
    username: '',
    nickname: '',
    loggedin: false,
    detailSpread: false
}

/* 保存在内存的属性 */
export interface INormalState {
    itinerary: IItinerary
    schedule: ISchedule
    currencyText: ICurrencyText[]
    payMode: IPayMode[]
    consumptionType: IConsumptionType[]
    isMobile: boolean
    systemOS: string
    loginShow: boolean
    serviceWorker: boolean
}
export const normalState: INormalState = {
    itinerary: {
        sort: 0,
        start_time: 0,
        title: '',
        description: '',
        currency: [],
        pay_mode: [],
        partner: []
    },
    schedule: {
        pid: 0,
        title: '',
        description: '',
        type: 1,
        sort: 0,
        tag: [],
        departure_time: ''
    },
    /* 货币种类及对应中文 */
    currencyText: [],
    /* 支付方式及对应中文 */
    payMode: [],
    /* 消费类型 */
    consumptionType: [
        {
            name: 'play',
            icon: '&#xe610;',
            color: '#88eedd',
            text: '玩',
            sort: 1
        },
        {
            name: 'food',
            icon: '&#xe611;',
            color: '#ffcc99',
            text: '吃',
            sort: 2
        },
        {
            name: 'traffic',
            icon: '&#xe642;',
            color: '#aae1f3',
            text: '行',
            sort: 5
        },
        {
            name: 'lodging',
            icon: '&#xe653;',
            color: '#ccb5fc',
            text: '住',
            sort: 4
        },
        {
            name: 'shopping',
            icon: '&#xe658;',
            color: '#fdb6c6',
            text: '购物',
            sort: 3
        },
        {
            name: 'other',
            icon: '&#xe618;',
            color: '#cccccc',
            text: '其他',
            sort: 6
        }
    ],
    isMobile: false,
    systemOS: '',
    loginShow: false,
    serviceWorker: false
}

// tslint:disable-next-line
export interface IState extends ILocalState {}
// tslint:disable-next-line
export interface IState extends INormalState {}
export interface ILocalStateM extends ILocalState {
    [index: string]: any
}
function getLocal(local: ILocalState): ILocalState {
    const result: ILocalStateM = Object.assign({}, local)
    for (const i of Object.keys(result)) {
        result[i] = getItem(i) || result[i]
    }
    return result
}

function merge(local: ILocalState, normal: INormalState): IState {
    return Object.assign({}, normal, getLocal(local))
}

export default merge(localState, normalState)
