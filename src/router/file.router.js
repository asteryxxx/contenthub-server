const Router = require("koa-router");
const {
    avatarHandler,
    MomentHandler,
    PictureResize
} = require('../middleware/file.middleware')
const fileRouter = new Router({ prefix: '/upload' });
const {
    DeleteMomentCover
} = require('../controller/moment.controller')
const {
    saveAvatarInfo,
    saveMomentInfo,
    saveDraftPic
} = require('../controller/file.controller.js')

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware');

fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo);
// fileRouter.post('/avatar/:userId', avatarHandler, saveAvatarInfo)
//上传头像必须要登录的。
//保存图像、保存图像的信息 都需要中间件
fileRouter.post('/moments', verifyAuth, MomentHandler, saveMomentInfo);
fileRouter.delete('/moments/:momentId', verifyAuth, DeleteMomentCover)
//【PictureResize中间件：是保存图片的同时生成1280/960/360尺寸的图】
fileRouter.post('/moments/draftPic', verifyAuth, MomentHandler, saveDraftPic);
//发表文章的草稿图片
module.exports = fileRouter;