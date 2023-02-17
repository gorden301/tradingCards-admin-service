const Router = require('koa-router')
const axios = require('axios')
const getAccessToken = require('../utils/getAccessToken')
const callCloudFn = require('../utils/callCloudFn')
const router = new Router()
const ENV = 'env-1gy0ivir5e756d6a'

router.get('/orderList', async (ctx, next) => {
    const getListRes = await callCloudFn(ctx, 'order', {
        $url: 'getOrderList'
    })
    ctx.body = {
        code: 0,
        data: JSON.parse(getListRes?.resp_data).data,
        msg: '请求成功'
    }
})

module.exports = router