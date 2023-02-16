const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const order = require('./controller/order.js')
router.use('/order', order.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx) => {
    ctx.body = 'hello wpo'
})

app.listen(3000, () => {
    console.log('服务运行在3000')
})