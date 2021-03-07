const Router = require('koa-router')

const ImagesRouter = new Router({ prefix: '/images' })

const {
  GetImagesByUserId,
  upload,
  showPic,
  showAllPic,
  cancelUserCollect,
  collectOpera,
  deleteImageById
} = require('../controller/images.controller.js')

const { verifyAuth } = require('../middleware/auth.middleware')

ImagesRouter.get('/', verifyAuth, showAllPic)
//查看全部素材圖片
ImagesRouter.get('/collect', verifyAuth, GetImagesByUserId)
//查看用户收藏的图片
ImagesRouter.post('/', verifyAuth, upload)
//上传用户图片素材
ImagesRouter.get('/sucai/:filename', showPic)
//显示图片
ImagesRouter.patch('/cancel/:imageId', verifyAuth, collectOpera)
//取消用户收藏
ImagesRouter.delete('/:imageId', verifyAuth, deleteImageById)
//删除素材
module.exports = ImagesRouter
