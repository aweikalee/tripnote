import ApiBase from './base'
import store from '@/store'

export default class extends ApiBase {
    constructor() {
        super({})
    }
    signature(message: string, loading = false) {
        return this.http.post<string>(
            '/oss/signature',
            {
                message
            },
            {
                loading
            }
        )
    }
}
