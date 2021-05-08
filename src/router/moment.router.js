const Router = require('koa-router');
const momentRouter = new Router({
    prefix: '/moment'
});
const {
    create,
    detailById,
    list,
    remove,
    addChannels,
    fileInfo,
    getHomemomentList,
    getHotmomentList,
    getChannelmomentListMore,
    searchbyquery
} = require('../controller/moment.controller')

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware');
const {
    verifyChannelExists
} = require('../middleware/channel.middleware')
const {
    MomentHandler
} = require('../middleware/file.middleware')

momentRouter.get('/searchbyquery', searchbyquery);
momentRouter.get('/homemoments', getHomemomentList)
momentRouter.get('/hotmoments', getHotmomentList)
momentRouter.get('/channelmomentsMore', getChannelmomentListMore)
momentRouter.get('/list',verifyAuth, list);
momentRouter.get('/:momentId', verifyAuth, detailById);

momentRouter.post('/', verifyAuth, create);
momentRouter.patch('/:momentId', verifyAuth,verifyPermission, create);
//修改条件：1)用户必须登录，有token 2)用户具备权限,只能修改自己的
momentRouter.delete('/:momentId', verifyAuth,verifyPermission, remove)

//给moment添加标签的接口【只有登录和有权限】
momentRouter.post('/:momentId/channels', verifyAuth, verifyPermission,
    verifyChannelExists, addChannels);
//获取 动态配图
momentRouter.get('/images/:filename', fileInfo)
//【http://localhost:8888/moment/images/日期/1612423207311.jpg"】

module.exports = momentRouter;