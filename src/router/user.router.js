const Router = require('koa-router');
const {
    create,
    ListUsers,
    avatarInfo,
    getUserProfile
} = require('../controller/user.controller')
const userRouter = new Router({
    prefix: "/users"
});
const {
    verifyUser,
    handlePassword
} = require('../middleware/user.middleware')
const {
    verifyAuth
} = require('../middleware/auth.middleware');
/* userRouter.post('/', (ctx, next) => {
    ctx.body = '创建用户成功'
}) */
userRouter.post('/',verifyUser,handlePassword, create);
//verifyUser：需要验证用户，防止名字重复
//handlePassword:对密码进行加密

userRouter.get('/profile', verifyAuth, getUserProfile)
/* class Person {
    sayhi() {
        console.log('hi...');
    }
}
const {
    sayhi
} = new Person();
sayhi(); 
*/
userRouter.get('/:userId/avatar', avatarInfo);
//展示用户头像

module.exports = userRouter;