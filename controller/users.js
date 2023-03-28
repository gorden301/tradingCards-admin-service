const Router = require('koa-router')
const axios = require('axios')
const getAccessToken = require('../utils/getAccessToken')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
const router = new Router()
const ENV = 'env-1gy0ivir5e756d6a'

router.post('/usersList', async (ctx, next) => {
    const params = ctx.request.body || {}
    const dataParam = JSON.parse(JSON.stringify(params))
    delete dataParam.page
    const userListCountQuery = `db.collection('userList').where(${JSON.stringify(dataParam)}).count()`
    const res = await callCloudDB(ctx, 'databasecount', userListCountQuery)
    const pageDataQuery = `db.collection('userList').orderBy('createTime', 'desc').where(${JSON.stringify(dataParam)}).skip(${(params.page - 1) * 10}).limit(10).get()`
    const pageRes = await callCloudDB(ctx, 'databasequery', pageDataQuery)
    const dataArr = pageRes?.data?.map((item) => {
        return JSON.parse(item)
    }) || []
    // console.log('pageRes', pageRes)
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

module.exports = router