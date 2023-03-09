const axios = require("axios");
const fs = require("fs");
const path = require("path");
const APP_ID = "wx69ac003c92fc8bb2";
const APP_SECRET = "2193d459e4837b1f6a48bc0a62c64038";
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;
const fileName = path.resolve(__dirname, "./access_token.json");

const updateAccessToken = async () => {
    const { data } = await axios.get(URL);
    // console.log(data);
    // 拿到token写入json文件
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    if (data?.access_token) {
        fs.writeFileSync(
            fileName,
            JSON.stringify({
                access_token: data.access_token,
                createTime: formatted_date,
            })
        );
    } else {
        await updateAccessToken();
    }
};

const getAccessToken = async () => {
    try {
        const readFileRes = await fs.readFileSync(fileName, "utf-8");
        const readObj = JSON.parse(readFileRes);
        const createTime = new Date(readObj.createTime).getTime();
        const currentTime = new Date().getTime();
        if ((currentTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updateAccessToken();
            await getAccessToken();
        }
        return readObj?.access_token;
    } catch (error) {
        await updateAccessToken();
        await getAccessToken();
    }
};

setInterval(async () => {
    await updateAccessToken();
}, (7200 - 1800) * 1000);

// console.log(getAccessToken())
module.exports = getAccessToken;
