const getAccessToken = require('./getAccessToken')
const axios = require('axios')
const FormData = require('form-data')
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
        }).then(res => res)
    },

    async upload(ctx) {
        // 1、请求地址
        const ACCESS_TOKEN = await getAccessToken()
        const file = ctx.request.files.file
        const path = `customerImgs/${Date.now()}-${Math.random()}-${file.originalFilename}`
        const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`
        //  请求参数的
        const info = await axios.post(url, {
            path,
            env: ctx.state.env
        }).then(res => res.data)
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
        const formData = new FormData()
        formData.append('key', path)
        formData.append('Signature', info.authorization)
        formData.append('x-cos-security-token', info.token)
        formData.append('x-cos-meta-fileid', info.cos_file_id)
        formData.append('file', fs.createReadStream(file.filepath))
        const headers = formData.getHeaders()
        const result = await axios.post(info.url, formData, {
            headers
        })
        console.log('nfo.file_idnfo.file_idnfo.file_id', info.file_id)
        return info.file_id
    },

    async delete(ctx, fileid_list) {
        const ACCESS_TOKEN = await getAccessToken()
        console.log('fileid_listfileid_list', fileid_list)
        const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`
        return await axios.post(url, {
            env: ctx.state.env,
            fileid_list: fileid_list
        }).then(res => {
            return res
        })
    }
}

module.exports = cloudStorage