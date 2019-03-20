/* tslint:disable:no-console */

import { register } from 'register-service-worker'
import store from '@/store'

if (process.env.NODE_ENV === 'production') {
    register(`/sw-${process.env.VUE_APP_FILE_SELF}.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                    'For more details, visit https://goo.gl/AFskqB'
            )
            store.commit('serviceWorker', true)
        },
        cached() {
            console.log('Content has been cached for offline use.')
            store.commit('serviceWorker', true)
        },
        updated() {
            console.log('New content is available; please refresh.')
        },
        offline() {
            console.log(
                'No internet connection found. App is running in offline mode.'
            )
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        }
    })
}
