const getAccessToken = require('./getAccessToken')
const axios = require('axios')
const fs = require('fs')

const cloudStorage = {
    async download(ctx, fileList) {
        const ACCESS_TOKEN = await getAccessToken()
        const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`
        // const options = {
        //     method: 'POST',
        //     uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
        //     body: {
        //         env: ctx.state.env,
        //         file_list: fileList
        //     },
        //     json: true
        // }
        return await axios.post(url, {
            env: ctx.state.env,
            file_list: fileList
        })
    },

    async upload(ctx) {
        // 1、请求地址
        const ACCESS_TOKEN = await getAccessToken()
        const file = ctx.request.files.file
        const path = `customerImgs/${Date.now()}-${Math.random()}-${file.name}`
        const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`
        //  请求参数的
        const info = await axios.post(url, {
            path,
            env: ctx.state.env
        })
        console.log(info)
        // 2、上传图片
        // const params = {
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     },
        //     uri: info.url,
        //     formData: {
        //         key: path,
        //         Signature: info.authorization,
        //         'x-cos-security-token': info.token,
        //         'x-cos-meta-fileid': info.cos_file_id,
        //         file: fs.createReadStream(file.path)
        //     },
        //     json: true
        // }
        const formData = new formData()
        formData.append('key', path)
        formData.append('Signature', info.authorization)
        formData.append('x-cos-security-token', info.cos_file_id)
        formData.append('file', fs.createReadStream(file.path))
        await axios.post(info.url, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }, {

        })
        return info.file_id
    },

    async delete(ctx, fileid_list) {
        const ACCESS_TOKEN = await getAccessToken()
        const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`
        return await axios.post(url, {
            env: ctx.state.env,
            fileid_list: fileid_list
        })
    }
}

module.exports = cloudStorage