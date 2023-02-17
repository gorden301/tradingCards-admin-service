const getAccessToken = require('./getAccessToken')
const axios = require('axios')

const callCloudFn = async (ctx, fnName, params) => {
    const access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`
    const res = await axios.post(url, {
        ...params
    })
    return res.data
}

module.exports = callCloudFn