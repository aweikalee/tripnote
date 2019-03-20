export interface IItinerary {
    id?: number
    state?: number
    days?: number
    sort: number
    start_time: number
    title: string
    description: string
    currency: ICurrency[]
    partner: IPartner[]
    pay_mode: string[]
}

export interface ISchedule {
    id?: number
    state?: number
    pid: number
    title: string
    description: string
    type: number
    sort: number
    tag: string[]
    departure_time: string
}

export interface IDetail {
    id?: number
    state?: number
    pid: number
    title: string
    description: string
    content: string
    type: string
    sort: number
    position: IPosition[]
    currency: string
    amount: number | string
    count: number
}

export interface ICurrency {
    id?: number
    name: string
    rate: number
}

export interface ICurrencyText {
    id: number
    name: string
    text: string
}

export interface IPayMode {
    id: number
    name: string
    text: string
}

export interface IPartner {
    id?: number
    uid: number
    nickname: string
}

export interface IPosition {
    title: string
    address: string
    x: number | string
    y: number | string
}

export interface IBill {
    id?: number
    state?: number
    pid: number
    type: string
    detail: string
    currency: string
    amount: number | string
    pay_mode: string
    payer: number[]
    participant: number[]
    balance: number[]
    create_time: number
    update_time: number
    count: number
}

export interface IConsumptionType {
    name: string
    text: string
    icon: string
    color: string
    sort: number
}

export interface IUserInfo {
    username?: string
    nickname?: string
    password?: string
}
