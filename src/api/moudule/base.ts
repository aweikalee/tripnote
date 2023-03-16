import Vue from 'vue'
import { server } from '@/config'
import { HttpRequest } from '@/api/http'
import { Adapt, IAdaptRuleOption } from '../adapt'

const http = new HttpRequest(
    {
        baseURL: server.baseUrl,
        timeout: 0,
        withCredentials: true // 携带cookie
    },
    {
        MIN_TIME: 100
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
