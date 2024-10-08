const name = import.meta.env.VITE_FILE_SELF // 项目名字 服务器上按项目名对文件进行分类

/*
 * 请求地址 需要区分 “生产环境”和“测试环境”
 * 其中测试环境又分为 “mock数据”和“本地服务器”
 * 所以baseUrl存在 [生产环境, mock数据, 本地测试环境] 3种
 *
 * oss则需要对应 生产环境 + [mock数据， 本地测试环境] * [mockOss数据, 生产oss]
 * 由于使用“mock数据”，签名是不可能通过验证的 所以mock时只能使用mockOss
 * 即 [生产环境, mock, 本地测试 + mockOss, 本地测试 + 生产oss]
 */

export const server = {
    name,
    baseUrl: `/api`,
    baseRouteUrl: `/`,
}
export const ossServer = {
    name,
    bucket: 'awwwk',
    baseUrl: '//awwwk.oss-cn-hangzhou.aliyuncs.com',
    accessid: 'LTAI5tDtX4HKna5rekfA18s5',
}

export const BMap: {
    version: string
    ak: string
    callbackName: 'BMapLoader'
} = {
    version: '3.0',
    ak: 'Do1xqqyFkX61HjUoDBn3PHuGZ6cbaVd0',
    callbackName: 'BMapLoader',
}
