const Router = require('koa-router')
const axios = require('axios')
const getAccessToken = require('../utils/getAccessToken')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
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
    // console.log('pageRes', pageRes)
    // console.log(getListRes)
    ctx.body = {
        code: 0,
        data: JSON.parse(getListRes?.resp_data).data,
        msg: '请求成功'
    }
})

router.post('/createOrder', async (ctx, next) => {
    const params = ctx.request.body || {}
    console.log('paramsparamsparams', params)
    const getListRes = await callCloudFn(ctx, 'order', {
        $url: 'createOrder',
        createData: {
            ...params,
            orderType: 1,
            cardImgs: params.fileIds,
            fileList: params.fileList,
            openid: params.openid
        }
    })
    const query = `
        db.collection('orderList').add({
            data: {
                orderType: '1',
                cardImgs: '${JSON.stringify(params.fileIds)}',
                comment: '${params.comment}',
                fileList: ${JSON.stringify(params.fileList)}',
                singleDetailList: '${JSON.stringify(params.singleDetailList)}',
                sellNumber: '${params.sellNumber}',
                openid: '${params.openid}'
                sellNumber: '${params.sellNumber}',
                openid: '${params.openid}'
                sellNumber: '${params.sellNumber}',
                openid: '${params.openid}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseadd', query)
    // console.log('pageRes', pageRes)
    console.log('getListRes', getListRes)
    ctx.body = {
        code: 0,
        data: (getListRes),
        msg: '请求成功'
    }
})

router.post('/newOrderList', async (ctx, next) => {
    const params = ctx.request.body || {}
    const dataParam = JSON.parse(JSON.stringify(params))
    delete dataParam.page
    const orderListCountQuery = `db.collection('orderList').where(${JSON.stringify(dataParam)}).count()`
    const res = await callCloudDB(ctx, 'databasecount', orderListCountQuery)
    const pageDataQuery = `db.collection('orderList').orderBy('createTime', 'desc').where(${JSON.stringify(dataParam)}).skip(${(params.page - 1) * 10}).limit(10).get()`
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

router.post('/updateOrder', async (ctx, next) => {
    const params = ctx.request.body
    // if (params.fileList) {

    // }
    console.log(params)
    const query = `
        db.collection('orderList').doc('${params._id}').update({
            data: {
                orderStatus: '${params.orderStatus}',
                customerComment: '${params.customerComment}',
                singleDetailList: '${JSON.stringify(params.singleDetailList)}',
                sellNumber: '${params.sellNumber}',
                updateTime: db.serverDate()
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    // console.log('调用calldb', res)
    ctx.body = {
        code: 0,
        data: res
    }
})

router.post('/uploadImg', async(ctx, next)=>{
    const fileid =  await cloudStorage.upload(ctx)
    console.log('fileid', fileid)
    const dlRes = await cloudStorage.download(ctx, [{
        max_age: 7200,
        fileid
    }])
    console.log('dlRes', dlRes)
    ctx.body = {
        code: 0,
        data: {
            fileid,
            download_url: dlRes?.data?.file_list[0]?.download_url
        }
    }
    // 写数据库
    //  const query = `
    //      db.collection('swiper').add({
    //          data: {
    //              fileid: '${fileid}'
    //          }
    //      })
    //  `
    // const res = await callCloudDB(ctx, 'databaseadd', query)
    // ctx.body = {
    //     code: 20000,
    //     id_list: res.id_list
    // }
 })

 router.post('/deleteStorageFile', async (ctx, next)=>{
    const params = ctx.request.body
    console.log('params', params)
    // 删除云存储中的文件
    const delStorageRes = await cloudStorage.delete(ctx, params.fileids)
    ctx.body = {
        code: 0,
        data: {
            delStorageRes: delStorageRes.delete_list
        }
    }
})

module.exports = router