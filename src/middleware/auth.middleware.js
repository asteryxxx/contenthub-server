const errerTypes = require('../costants/error-types')
const Useservice = require('../service/user.service');
const Authservice = require('../service/auth.service');
const md5password = require('../utils/password-handle');
const {
    PUBLIC_KEY
} = require('../app/config')
const jwt = require('jsonwebtoken');

const verifyLogin = async (ctx, next) => {
    //获取用户名和密码
    const {
        name,password
    } = ctx.request.body;
    console.log('form表单接受的：'+name,password);
    //判断用户名和密码是否为空
   if (!name || !password) {
       const errormess = new Error(errerTypes.NAME_OR_PASSWORD_IS_REQUIRED);
       return ctx.app.emit('error', errormess, ctx);
    }
    console.log('判断1——————',name,password);
    //判断用户是否存在
    /*  [
         BinaryRow {
             id: 1,
             name: 'zhh',
             password: '123456',
             createAt: null,
             updateAt: 2021 - 01 - 28 T08: 48: 29.000 Z,
             avatar_url: null
         }
     ] 之前获取的是可能有很多条数据，所以要取第一个  */
    const res = await Useservice.getUserByName(name);
    const user = res[0];
    console.log(user);
  /*   BinaryRow {
        id: 1,
        name: 'zhh',
        password: '123456',
        createAt: null,
        updateAt: 2021 - 01 - 28 T08: 48: 29.000 Z,
        avatar_url: null
    } */
    if (!user) {
        //如果用户不存在,是空数组[]
        const errormess = new Error(errerTypes.USER_DOES_NOT_EXISTS);
        return ctx.app.emit('error', errormess, ctx);
   }

    //判断密码是否和数据库中的密码是否一致（加密）
    if (md5password(password) !== user.password) {
        const errormess = new Error(errerTypes.PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error', errormess, ctx);
    }
    ctx.user = user;
    //处理完要next();
    await next();
}

const verifyAuth = async (ctx, next) => {
    console.log('进入verifyAuth方法...');
    const author = ctx.headers.authorization;
    //console.log(author);//如果我们不传token 就是undefined
    if (!author) {
        //如果不携带token 就报错
         const errormess = new Error(errerTypes.BRING_TOKEN);
         return ctx.app.emit('error', errormess, ctx);
    }
    //多了Bearer ，替换掉
    const token = author.replace('Bearer ', "");
    //验证token。最好捕获下异常，可能会token过期
    //返回id/name/exp等
    try {
        const res = jwt.verify(token, PUBLIC_KEY, {
            algorithm: ["RS256"]
            //这里也要告诉他算法
        });
        ctx.user = res;
        await next();
        //验证通过放行
    } catch (error) {
        console.log('tokenAuth校验报错了，原因如下：'+ error.message);
        //jwt expired 说明是过期了
        const errormess = new Error(errerTypes.TOKEN_ERROR);
        ctx.app.emit('error', errormess, ctx);
    }
}


const verifyPermission = async (ctx, next) => {
    console.log('进入verifyPermission方法...');
    console.log(ctx.params);
    //{ commentId: '1' } 
    const [resourceKey] = Object.keys(ctx.params);
    //数组解构得到：['xxx','yyy'],然后只取第一个下标的值xxx
    //因为我们得到的参数都是以xxxId为后缀的，所以就可以得到动态表名
    const tableName = resourceKey.replace('Id', "");
    const resourceValue = ctx.params[resourceKey];
    console.log("resourceValue:"+resourceValue)
    //虽然我们在修改的时候传的字段是：commentId,momentId 但是实际修改的时候
    //我们修改数据库的时候是改的id的数据库字段
    //例如： update moment/comment set content = ? where id = ?

        //1、获取参数
        const {id } = ctx.user;
        //2、查询是否具有权限
        try {
            //方法：【checkResource(tableName, id, userId)】方法第二个参数id就对应的是value值
            const isPermission = await Authservice.checkResource(tableName, resourceValue, id);
            //为true说明不具备权限
            if (isPermission) {
                console.log('不具备权限~~');
                throw new Error('不具备权限~~');
                //抛出错误统一由UNPERMISSION捕获异常
            } else {
                console.log('有权限哦~~')
                //通行
                await next();
            }
        } catch (error) {
            //其他的错误情况
            const errermessage = new Error(errerTypes.UNPERMISSION);
            return ctx.app.emit('error', errermessage, ctx);
        }
    }

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission,
}