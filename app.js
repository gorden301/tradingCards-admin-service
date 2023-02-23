const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const ENV = 'env-1gy0ivir5e756d6a'

app.use(cors({
    origin: ['http://101.43.19.137'],
    credentials: true
}))

app.use(async (ctx, next) => {
    ctx.state.env = ENV
    await next()
})

const order = require('./controller/order.js')
router.use('/order', order.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('服务运行在3000')
})