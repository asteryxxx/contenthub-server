const errerTypes = require('../costants/error-types')
const service = require('../service/user.service')
const md5password = require('../utils/password-handle')

const verifyUser = async (ctx, next) => {
    console.log('进入verifyuser....')
    //1、获取用户名和密码
    const { name, password } = ctx.request.body;
    //2、判断用户名和密码不能空

    if (!name || !password ) {
        const errormess = new Error(errerTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error', errormess, ctx);
    }
   //【|| name === '' || password === ''】他这里如果你传name=''是false ,然后!name是true
  //  所以直接用!name即可。
  //没传name的时候，name为undefined，然后!name就为true
    
    //3、判断这次注册的用户名是不是没注册过的。
    const res = await service.getUserByName(name);
    //如果有长度说明查到了重复的用户名
    if (res.length) {
        const errormess = new Error(errerTypes.USER_ALREADY_EXISTS);
        return ctx.app.emit('error', errormess, ctx);
    }

//userRouter.post('/',verifyUser, create);    
//如果在verifyUser中间件不next，就不会执行create下一个中间件。
//只有你在满足所有条件的时候，我们在执行next()，然后最后会执行create中间件
     await next();
}
//对密码加密
const handlePassword = async (ctx, next) => {
    const { password } = ctx.request.body;
    ctx.request.body.password = md5password(password);
    //处理完要next();
    await next();
}
module.exports = {
    verifyUser,
    handlePassword
}