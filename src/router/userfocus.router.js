const Router = require('koa-router')
const userfocusRouter = new Router({
  prefix: '/userfocus'
})
const {
  showfollow,
  showfans,
  showrecommends,
  deletefan,
  followuser
} = require('../controller/userfocus.controller.js')
const {
  verifyAuth,
} = require('../middleware/auth.middleware')
userfocusRouter.get('/showfollow',verifyAuth,showfollow)
userfocusRouter.get('/showfans', verifyAuth, showfans)
userfocusRouter.get('/showrecommends', verifyAuth, showrecommends)
userfocusRouter.delete('/deletefan/:userId', verifyAuth, deletefan)
userfocusRouter.post('/followuser/:userId', verifyAuth, followuser)
module.exports = userfocusRouter
