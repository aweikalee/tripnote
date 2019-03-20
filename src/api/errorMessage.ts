interface ICodeMap {
    [index: string]: string
}
const codeMap: ICodeMap = {
    204: '没有数据',
    404: '请求的地址不存在',
    503: '服务不可用'
}

export function getErrorMessage(code: string | number): string {
    return codeMap.hasOwnProperty(code) ? codeMap[code] : ''
}
