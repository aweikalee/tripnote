const Mock = require('mockjs')

const itinerary = {
    'id|+1': 1,
    title: '@city()',
    description: '@cparagraph(0, 3)',
    'start_time|1400000000-1600000000': 1,
    partner: [
        {
            id: 1,
            uid: 1,
            nickname: '张三'
        },
        {
            id: 2,
            uid: 0,
            nickname: '李四'
        },
        {
            id: 3,
            uid: 0,
            nickname: '王小五'
        },
        {
            id: 4,
            uid: 0,
            nickname: '诸葛赵六'
        }
    ],
    currency: [
        {
            id: 1,
            name: 'HKD',
            rate: 1.1329
        },
        {
            id: 2,
            name: 'USD',
            rate: 6.18
        }
    ],
    pay_mode: ['cash', 'credit', 'alipay', 'wechatpay', 'octopus'],
    days: 5
}
const schedule = {
    'id|+1': 1,
    pid: 1,
    title: '@csentence(2, 9)',
    description: '@cparagraph(1, 3)',
    'type|1': [1, 1, 1, 1, 1, 2],
    'sort|1-50': 1,
    'tag|3-5': ['@cword(2, 7)'],
    departure_time: '08:30'
}
const position = {
    title: '@cword(0, 10)',
    address: '@cword(1, 30)',
    'x|80-140.6': 1,
    'y|18-50.6': 1
}
const detail = {
    'id|+1': 1,
    pid: 1,
    title: '@csentence(2, 20)',
    description: '@cparagraph(1, 3)',
    content: `@cparagraph(5, 10)

![@cword(0, 10)](test.jpg)
![@cword(0, 10)](@image())`,
    'type|1': ['play', 'food', 'lodging', 'traffic', 'shopping', 'other'],
    'sort|+1': 1,
    'position|0-3': [
        {
            title: '@cword(0, 10)',
            address: '@cword(1, 30)',
            'x|80-140.6': 1,
            'y|18-50.6': 1
        }
    ],
    'currency|1': ['HKD', 'CNY', 'USD'],
    'amount|0-1200.0-2': 315,
    'count|1': [1, 1, 1, 1, 1, 0]
}
const billPartner = [
    [1],
    [2],
    [3],
    [4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
    [1, 2, 3],
    [1, 2, 4],
    [2, 3, 4],
    [1, 2, 3, 4]
]
const bill = {
    'id|+1': 1,
    pid: 1,
    'type|1': ['play', 'food', 'lodging', 'traffic', 'shopping', 'other'],
    detail: '@csentence(0, 30)',
    'currency|1': ['HKD', 'CNY', 'USD'],
    'amount|1-1500': 1,
    'pay_mode|1': ['cash', 'credit', 'alipay', 'wechatpay', 'octopus'],
    'payer|1': billPartner,
    'participant|1': billPartner,
    'balance|1': billPartner,
    'create_time|1500000000-1500900000': 1,
    'update_time|1500000000-1500900000': 345600,
    'count|1': [1, 1, 1, 1, 1, 0],
    'state|1': [1, 1, 1, 1, 1, 0]
}
module.exports = {
    get: {
        'itinerary/:id': itinerary,
        'itineraries/:page|50': [itinerary],
        'schedule/:id': schedule,
        'schedules/:pid|3-20': [schedule],
        'detail/:id': detail,
        'details/:pid|0-30': [detail],
        'bill/id/:id': bill,
        'bills/:pid|0-100': [bill],
        'bill/:pid/count|0-50': 1,
        'position/itinerary/:id|0-20': [position],
        'position/schedule/:id|0-10': [position],
        'config/currency': [
            { name: 'CNY', text: '人民币' },
            { name: 'USD', text: '美元' }
        ],
        'config/paymode': [
            { name: 'cash', text: '现金' },
            { name: 'credit', text: '刷卡' },
            { name: 'alipay', text: '支付宝' },
            { name: 'wechatpay', text: '微信支付' }
        ],
        'img/tripnote/:filename': null // Random.dataImage('200x200')
    },

    /* 创建 */
    post: {
        itinerary: null,
        schedule: null,
        detail: null,
        bill: null,
        bills: null,
        login: {
            username: 'test',
            nickname: '毛呆'
        },
        logout: null,
        register: null,
        'oss/signature': 'aaaaaaaaa',
        img: null
    },

    /* 更新 */
    put: {
        itinerary: null,
        schedule: null,
        detail: null,
        bill: null,
        setpassword: null
    },

    /* 排序 */
    patch: {
        'schedules/sort': null,
        'details/sort': null
    },

    /* 删除 */
    delete: {
        'itinerary/:id': null,
        'schedule/:id': null,
        'detail/:id': null,
        'bill/:id': null
    },

    /* head */
    head: {
        'img/tripnote/:filename': null
    }
}
