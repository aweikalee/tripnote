const Express = require('express')
const Mock = require('mockjs')
const router = Express.Router()
const data = require('./index.js')
const path = require('path');

const status = {
    get: 200,
    post: 201,
    put: 200,
    patch: 200,
    delete: 204
    // head: 404 Express.Router似乎不支持head 会认为是get
}
for (let method in data) {
    const apiLists = data[method]
    for (let key in apiLists) {
        const apiName = key.split('|')[0]
        const param = {}
        param[key] = apiLists[key]
        router[method]('/' + apiName, (req, res) => {
            const theStatus = status[method]
            if (apiName === 'img/tripnote/:filename') {
                res.sendFile(path.resolve('./mocks/400x400.png'))
            } else {
                res.status(theStatus).json(Mock.mock(param)[apiName])
            }
        })
    }
}

module.exports = router
