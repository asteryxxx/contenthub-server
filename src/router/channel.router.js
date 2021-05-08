const Router = require('koa-router');
const {
    verifyAuth
} = require('../middleware/auth.middleware');
const channelRouter = new Router({
    prefix: '/channel'
});
const {
    create,
    list,
    nologinlist,
    loginbyUser,
    deleteChannelByuserId,
    addUserchannel
} = require('../controller/channel.controller')
channelRouter.post('/', verifyAuth, create);
channelRouter.post('/adduserchannel', verifyAuth, addUserchannel);
channelRouter.get('/', list);
channelRouter.get('/nologin', nologinlist)
channelRouter.get('/loginUser', verifyAuth, loginbyUser);
channelRouter.delete('/', verifyAuth, deleteChannelByuserId)

module.exports = channelRouter;