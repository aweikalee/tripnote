import { Store, MutationTree } from 'vuex'
import { Route } from 'vue-router'
import { getItem, setItem, setState } from './method'
import { IState } from './state'
import { IItinerary, IUserInfo, ISchedule } from '@/views'

const mutations: MutationTree<IState> = {
    setState(
        state,
        {
            key,
            value
        }: {
            key: string
            value: any
        }
    ) {
        setState(state, key, value)
    },
    itinerary(state, value: IItinerary) {
        state.itinerary = Object.assign(
            {
                sort: 0,
                start_time: 0,
                title: '',
                currency: [],
                pay_mode: [],
                partner: []
            },
            value
        )
    },
    schedule(state, value: ISchedule) {
        state.schedule = Object.assign(
            {
                pid: 0,
                title: '',
                description: '',
                type: 1,
                sort: 0,
                tag: [],
                departure_time: ''
            },
            value
        )
    },
    lastRoute(state, route: Route) {
        setState(state, 'lastRoute', route.path)
    },
    currencyText(state, result) {
        state.currencyText = result
    },
    payMode(state, result) {
        state.payMode = result
    },
    drafts(state, payload: { name: string; value: any }) {
        const time = new Date().getTime()
        state.drafts.push({
            name: payload.name,
            value: payload.value,
            time
        })
        setState(
            state,
            'drafts',
            Object.assign(state.drafts, {
                [payload.name]: payload.value
            })
        )
    },
    username(state, username: string) {
        setState(state, 'username', username, 2592000)
    },
    login(state, payload: IUserInfo) {
        setState(state, 'username', payload.username, 2592000)
        setState(state, 'nickname', payload.nickname, 2592000)
        setState(state, 'loggedin', true, 2592000)
    },
    logout(state) {
        setState(state, 'loggedin', false)
    },
    detailSpread(state, value: boolean) {
        setState(state, 'detailSpread', value)
    },
    loginShow(state, value: boolean) {
        state.loginShow = value
    },
    serviceWorker(state, value: boolean) {
        state.serviceWorker = value
    }
}
export default mutations
