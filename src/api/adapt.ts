import { ts } from '@/utils/date'

export interface IAdaptRule {
    [name: string]: string[]
}
export interface IAdaptRuleOption {
    [name: string]: string
}
const adaptMap: {
    [name: string]: (data: any, field: string, isGet: boolean) => void
} = {
    array(data, field, isGet) {
        if (isGet && data && field in data && !Array.isArray(data[field])) {
            data[field] = []
        }
    },
    timestamp(data, field, isGet) {
        if (data && field in data) {
            data[field] = isGet
                ? data[field] * 1000
                : Math.round(data[field] / 1000)
        }
    },
    UTC(data, field, isGet) {
        if (data && field in data) {
            data[field] = isGet
                ? ts.UTCToLocal(data[field])
                : ts.LocalToUTC(data[field])
        }
    }
}
export class Adapt {
    rule: IAdaptRule = {}
    constructor(rule?: IAdaptRuleOption) {
        if (rule) {
            for (const i in rule) {
                if (!i) {
                    continue
                }
                this.rule[i] = rule[i].split('|')
            }
        }
    }
    run(data: any, isGet = false) {
        const rule = this.rule
        const arr = Array.isArray(data) ? data : [data]

        for (const field in rule) {
            if (!field) {
                continue
            }
            const ruleArr = [...rule[field]]
            if (isGet) {
                ruleArr.reverse()
            }
            ruleArr.forEach((method) => {
                arr.forEach((item) => {
                    if (adaptMap[method]) {
                        adaptMap[method](item, field, isGet)
                    }
                })
            })
        }
    }
}
