const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
    ctx.body = 'hello wpo'
})

app.listen(3000, () => {
    console.log('服务运行在3000')
})