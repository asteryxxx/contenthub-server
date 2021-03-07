const koa = require('koa');
const app = new koa();
const cors = require('koa2-cors');

app.use(cors());
// const authRouter = require('../router/auth.router');
// const userRouter = require('../router/user.router');
const useRoutes = require('../router/index')
//统一导入路由
//处理路由的
const bodyParser = require('koa-bodyparser');
//处理请求的
const errorHandler = require('../app/error-handle')
//处理错误的

app.use(bodyParser());

useRoutes(app);//把app传进去

/* app.use(authRouter.routes());
app.use(authRouter.allowedMethods())
app.use(userRouter.routes());
app.use(userRouter.allowedMethods()) */
//查看请求方式有没有，没有就返回一些错误信息。
app.on('error', errorHandler);

module.exports = app;