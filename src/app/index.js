const koa = require('koa');
const app = new koa();
const cors = require('koa2-cors');

app.use(cors());
/* app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      return '*' //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
) */

/* "h5": {
        "devServer": {
        "disableHostCheck": true,
        "proxy": {
            "/api": {
                "target": "http://localhost:8888/",
                "changeOrigin": true,
                "pathRewrite": {"^/api" : ""}
            }
        }
    }
} */

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