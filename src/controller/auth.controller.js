const jwt = require('jsonwebtoken');
const {
    PRIVATE_KEY,
} = require('../app/config')

class AuthController {
    async login(ctx, next) {
        console.log('进入AuthController的login..');
        const {id,name} = ctx.user;
        const token = jwt.sign({
            id,
            name
        }, PRIVATE_KEY, {
            //PRIVATE_KEY 也可以传Buffer
            expiresIn: 24 * 60 * 100,//24 * 60 * 100
            //令牌过期时间
            //因为使用了公钥和私钥，采用非对称加密，所以要告诉他的算法是什么
            algorithm: "RS256"
        })
        ctx.body = {
            status: '200',
            data: { id, name, token }
         }
        ;
    };

    async success(ctx, next) {
        ctx.body = {
            status: '200',
            data: { 
                message:'授权成功,token有效~'
            }
         }
    };
}

module.exports = new AuthController();