import { format as dateFnsFormat } from 'date-fns'
import zh_cn from 'date-fns/locale/zh_cn'

export const format = (date: Date | string | number, formatStr?: string) => {
    return dateFnsFormat(date, formatStr, {
        locale: zh_cn
    })
}

/* timestamp缩写 */
export const ts = {
    addHours(timestamp: number, offset: number) {
        return timestamp + offset * 3600000
    },
    addDay(timestamp: number, offset: number) {
        return timestamp + offset * 86400000
    },
    /* 将UTC时间戳转化为当地同时间点的时间戳 比如UTC8点转成东8区8点，相当于UTC0点，时间戳-8小时 */
    UTCToLocal(timestamp: number) {
        const offset = new Date().getTimezoneOffset()
        return timestamp + offset * 60000
    },
    /* 与UTCToLocal相反 */
    LocalToUTC(timestamp: number) {
        const offset = new Date().getTimezoneOffset()
        return timestamp - offset * 60000
    },
    toUTCZeroClock(timestamp: number, UTC?: false) {
        const time = UTC ? timestamp : ts.LocalToUTC(timestamp)
        return Math.floor(time / 86400000) * 86400000
    },

}
