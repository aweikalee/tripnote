export interface IDebounceMethod extends Function {
    debounceId?: number
}
export interface IThrottleMethod extends Function {
    throttleId?: number
}

/* 以method为对象 进行防抖（调用时确保是同一个method） */
export function debounce(
    method: IDebounceMethod,
    context: any,
    time = 100,
    ...args: any[]
) {
    if (method.debounceId) {
        clearTimeout(method.debounceId)
    }
    method.debounceId = setTimeout(() => {
        method.call(context, ...args)
    }, time)
}

/* 返回一个包装好的防抖方法 */
export function getDebounce(
    method: (...args: any[]) => void,
    context: any,
    time = 100
) {
    let timer: number
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            method.call(context, ...args)
        }, time)
    }
}

/* 以method为对象 进行节流（调用时确保是同一个method） */
export function throttle(
    method: IThrottleMethod,
    context: any,
    time = 100,
    ...args: any[]
) {
    if (!method.throttleId) {
        method.throttleId = setTimeout(() => {
            method.call(context, ...args)
            method.throttleId = 0
        }, time)
    }
}

/* 返回一个包装好的节流方法 */
export function getThrottle(
    method: (...args: any[]) => void,
    context: any,
    time = 100
) {
    let timer: number
    return (...args: any[]) => {
        if (!timer) {
            timer = setTimeout(() => {
                method.call(context, ...args)
                timer = 0
            }, time)
        }
    }
}
