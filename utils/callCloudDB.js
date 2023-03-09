const getAccessToken = require('./getAccessToken')
const axios = require('axios')

const callCloudDB = async (ctx, fnName, query = {}) => {
    const access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`
    const res = await axios.post(url, {
        query,
        env: ctx.state.env
    })
    // console.log('数据库更新', res.data)
    return res.data
}

module.exports = callCloudDB