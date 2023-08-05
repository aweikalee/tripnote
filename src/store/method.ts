/*
 * 将state保存在localStorage的封装
 * 将会进行JSON编码和解码
 */

const now = Math.round(new Date().getTime() / 1000)
interface ILocalItem {
    value: any
    expires?: number
}
/**
 * 保存数据
 * @param key 键名
 * @param value 键值
 */
export function setItem(key: string, value: any, expires?: number) {
    const data: ILocalItem = { value }
    if (expires && expires > 0) {
        data.expires = Math.round(new Date().getTime() / 1000) + expires
    }
    localStorage.setItem(
        `${import.meta.env.VITE_FILE_SELF}_${key}`,
        JSON.stringify(data)
    )
}

/**
 * 获取数据
 * @param key 键名
 */
export function getItem(key: string) {
    try {
        const data: string | null = localStorage.getItem(
            `${import.meta.env.VITE_FILE_SELF}_${key}`
        )
        const result: ILocalItem =
            data === null ? { value: '' } : JSON.parse(data)
        if (!result.expires || result.expires > now) {
            return result.value
        } else {
            return ''
        }
    } catch (err) {
        return ''
    }
}

/**
 * 同时进行state保存和localStorage保存
 * @param state
 * @param key 键名
 * @param value 键值
 */
export function setState(
    state: any,
    key: string,
    value: any,
    expires?: number
) {
    state[key] = value
    setItem(key, value, expires)
}
