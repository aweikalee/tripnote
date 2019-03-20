import { Notify } from '@/plugins/element'
import { getDebounce } from '@/utils/timeInterval'
import store from '@/store'

const errorHandler: {
    [name: number]: () => void
} = {
    401: getDebounce(() => {
        /* 身份验证错误 */
        store.commit('logout')
        store.commit('loginShow', true)
        Notify.error({
            title: '',
            message: '帐号验证错误，请重新登录',
            duration: 0
        })
    }, null),
    403: getDebounce(() => {
        /* 服务器拒绝请求 */
        Notify.warning({
            title: '',
            message: '被服务器无情拒绝了',
            duration: 0
        })
    }, null),
    405: getDebounce(() => {
        /* 没有访问权限 */
        Notify.warning({
            title: '',
            message: '没有访问权限',
            duration: 0
        })
    }, null),
    500: getDebounce(() => {
        /* 没有访问权限 */
        Notify.warning({
            title: '',
            message: '出现了不可描述的错误',
            duration: 0
        })
    }, null)
}
export default errorHandler
