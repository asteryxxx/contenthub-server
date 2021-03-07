const koa = require('koa');
const app = new koa();
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const testRouter = new Router();
//密钥要弄常量。解密也要通过这个
const SECRET_KEY = 'miyao123';

const PRIVATE_KEY = fs.readFileSync('../../keys/private.key');
//readFileSync这种情况返回的是Buffer
const PUBLIC_KEY = fs.readFileSync('../../keys/public.key');

//登陆接口
//肯定要验证用户登陆的，登陆成功之后就会来到这里，颁发令牌
testRouter.post('/testjwt', (ctx, next) => {
    const user = { id: 110, name: 'lx' };
    // sign第一个参数就是:payload携带的数据
    // sign第二个参数：要设置一个secretKey密钥，通过将之前两个结果进行hma256算法
    const token = jwt.sign(user, PRIVATE_KEY, {
        //PRIVATE_KEY 也可以传Buffer的
        expiresIn: 5,
        //令牌过期时间
        //因为使用了公钥和私钥，采用非对称加密，所以要告诉他的算法是什么
        algorithm:"RS256"

    })
    ctx.body = token;
    //返回token给客户端
})

//验证接口
testRouter.get('/demo', (ctx, next) => {
    const author = ctx.headers.authorization;
    //多了Bearer ，替换掉
    const token = author.replace('Bearer ', "");
    //验证token。最好捕获下异常，可能会token过期
    try {
        const res = jwt.verify(token, PUBLIC_KEY, {
            algorithm: ["RS256"]
            //这里也要告诉他算法
        });
        ctx.body = res;
    } catch (error) {
        console.log(error.message);
        //jwt expired 说明是过期了
        ctx.body = 'token是无效的...'        
    }
})
app.use(testRouter.routes());
app.use(testRouter.allowedMethods());
app.listen(8000);