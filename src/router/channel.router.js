const Router = require('koa-router');
const {
    verifyAuth
} = require('../middleware/auth.middleware');
const channelRouter = new Router({
    prefix: '/channel'
});
const {
    create,
    list
} = require('../controller/channel.controller')
channelRouter.post('/', verifyAuth, create);
channelRouter.get('/', list);

module.exports = channelRouter;