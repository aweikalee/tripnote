import Vue from 'vue'
import { server } from '@/config'
import { HttpRequest } from '@/api/http'
import { Adapt, IAdaptRuleOption } from '../adapt'
import store from '@/store'

const http = new HttpRequest(
    {
        baseURL: server.baseUrl,
        timeout: 0,
        withCredentials: true, // 携带cookie
    },
    {
        MIN_TIME: 100,
    }
)

http.instance.interceptors.request.use(
    /* 请求发送之前 */
    (config) => {
        const token = store.state.token
        const newToken = token ? 'Bearer ' + token : undefined
        config.headers['Authorization'] = newToken

        return config
    },

    /* 发送请求错误时 */
    (error) => {
        return Promise.reject(error)
    }
)

export default class {
    http = http
    adaptor: Adapt
    constructor(rule?: IAdaptRuleOption) {
        this.adaptor = new Adapt(rule)
    }
    adapt<T>(data: T, isGet = false): T {
        if (!data) {
            return data
        }
        const dataCopy = JSON.parse(JSON.stringify(data))
        this.adaptor.run(dataCopy, isGet)
        return dataCopy
    }
}
