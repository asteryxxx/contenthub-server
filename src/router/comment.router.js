const Router = require('koa-router')
const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')
const commentRouter = new Router({
  prefix: '/comment'
})

const {
  create,
  reply,
  update,
  remove,
  list,
  showcommentstatus,
  updateMomentCanRepleyStatus
} = require('../controller/comment.controller')

commentRouter.post('/', verifyAuth, create)
commentRouter.post('/:commentId/reply', verifyAuth, reply)
//这样符合resful风格
//修改评论
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
//获取评论列表
commentRouter.get('/', list)
commentRouter.get('/momentStatus', verifyAuth, showcommentstatus)

//修改文章的评论状态
commentRouter.patch(
  '/momentStatus/:momentId',
  verifyAuth,
  updateMomentCanRepleyStatus
)

module.exports = commentRouter
