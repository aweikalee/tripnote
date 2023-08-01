import ApiBase from './base'
import store from '@/store'

export default class extends ApiBase {
    constructor() {
        super({})
    }
    login(username: string, password: string) {
        return this.http.post<{
            username: string
            nickname: string
            token: string
        }>('/login', {
            username,
            password
        })
    }
    logout() {
        return new Promise((resolve, reject) => {
            this.http.post('/logout').catch((err) => reject(err))
            store.commit('logout')
            resolve(null)
        })
    }
    register(data: any) {
        return this.http.post('/register', data)
    }
    setpassword(password: any) {
        const data = Object.assign(
            {
                username: store.state.username
            },
            password
        )
        return this.http.put('/setpassword', data)
    }
}
