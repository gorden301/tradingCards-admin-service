const Router = require('koa-router')
const axios = require('axios')
const getAccessToken = require('../utils/getAccessToken')
const router = new Router()
const ENV = 'env-1gy0ivir5e756d6a'

router.get('/orderList', async (ctx, next) => {
    const access_token = await getAccessToken()
    // 查询所有订单
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=order` 
    const getListRes = await axios.post(url, {
        $url: 'getOrderList'
    })
    console.log(getListRes?.data)
    ctx.body = JSON.parse(getListRes?.data.resp_data).data
})

module.exports = router