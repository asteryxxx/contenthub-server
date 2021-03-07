const Router = require('koa-router');
const authRouter = new Router();
const {
    login,
    success
} = require('../controller/auth.controller')
const {
    verifyLogin,
    verifyAuth
} = require('../middleware/auth.middleware')

authRouter.post('/login', verifyLogin, login)
//verifyLogin：登陆的校验
authRouter.get('/testtoken', verifyAuth,success)
//验证是否授权

module.exports = authRouter;