import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import { scrollTo } from '@/utils/scroll'

Validator.extend('array_repeat', <T>(value: T, options: any) => {
    const method = options.method
        ? options.method
        : (a: T, b: T) => {
              return a === b
          }
    return options.data.find((item: any, index: number) => method(value, item, index))
        ? false
        : true
})

Validator.extend('array_required', (value: any, options: any) => {
    return value.length > 0
})

Validator.extend('greater', (value: any, min: any = 0) => {
    return value > min
})

const localizeOption = {
    name: 'zh_CN',
    messages: zh_CN.messages,
    attributes: {}
}
Object.assign(localizeOption.messages, {
    array_repeat: (filed: string) => `${filed}重复`,
    array_required: (filed: string) => `${filed}不能为空`,
    greater: (filed: string, min: number) => `${filed}必须大于${min}`
})

Validator.localize('zh_CN', localizeOption)

export default VeeValidate
export const focusField = (
    elt: Element,
    filedName: string,
    parent?: HTMLElement | Window
) => {
    const target: HTMLElement =
        elt.querySelector(`[title='${filedName}']`) ||
        elt.querySelector(`[name='${filedName}']`) ||
        elt.querySelector(`[data-vv-name='${filedName}']`) ||
        document.createElement('div')
    let scrollParent: HTMLElement | Window
    if (parent) {
        scrollParent = parent
    } else if (target && target.offsetParent) {
        scrollParent = target.offsetParent as HTMLElement
    } else {
        scrollParent = document.body
    }
    scrollTo(target, scrollParent, -120)
}
