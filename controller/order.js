const Router = require('koa-router')
const axios = require('axios')
const getAccessToken = require('../utils/getAccessToken')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')
const router = new Router()
const ENV = 'env-1gy0ivir5e756d6a'
router.get('/orderList', async (ctx, next) => {
    const getListRes = await callCloudFn(ctx, 'order', {
        $url: 'getOrderList'
    })
    const orderListCountQuery = `db.collection('orderList').count()`
    const res = await callCloudDB(ctx, 'databasecount', orderListCountQuery)
    const pageDataQuery = `db.collection('orderList').orderBy('createTime', 'desc').skip(10).limit(10).get()`
    const pageRes = await callCloudDB(ctx, 'databasequery', pageDataQuery)
    console.log('pageRes', pageRes)
    // console.log(getListRes)
    ctx.body = {
        code: 0,
        data: JSON.parse(getListRes?.resp_data).data,
        msg: '请求成功'
    }
})

router.post('/newOrderList', async (ctx, next) => {
    const params = ctx.request.body
    const orderListCountQuery = `db.collection('orderList').count()`
    const res = await callCloudDB(ctx, 'databasecount', orderListCountQuery)
    const pageDataQuery = `db.collection('orderList').orderBy('createTime', 'desc').skip(${(params.page - 1) * 10}).limit(10).get()`
    const pageRes = await callCloudDB(ctx, 'databasequery', pageDataQuery)
    const dataArr = pageRes?.data.map((item) => {
        return JSON.parse(item)
    })
    console.log('pageRes', pageRes)
    // console.log(getListRes)
    ctx.body = {
        code: 0,
        data: {
            total: res.count,
            data: dataArr
        },
        msg: '请求成功'
    }
})

router.post('/updateOrder', async (ctx, next) => {
    const params = ctx.request.body
    console.log(params)
    const query = `
        db.collection('orderList').doc('${params._id}').update({
            data: {
                orderStatus: '${params.orderStatus}',
                customerComment: '${params.customerComment}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    console.log('调用calldb', res)
    ctx.body = {
        code: 0,
        data: res
    }
})

module.exports = router