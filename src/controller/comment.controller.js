const commentService = require('../service/comment.service')
const momentService = require('../service/moment.service')

class CommentController {
  async create (ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user

    const res = await commentService.create(momentId, content, id)
    ctx.body = '发布评论成功~' + res
  }

  async reply (ctx, next) {
    //针对于哪一条评论的评论
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user
    const { commentId } = ctx.params
    const res = await commentService.reply(momentId, content, commentId, id)
    ctx.body = '回复评论成功~' + res
  }
  async update (ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const res = await commentService.update(commentId, content)
    ctx.body = '修改评论成功~' + res
  }
  async remove (ctx, next) {
    //1、获取commentId
    const { commentId } = ctx.params
    //2、删除内容
    const res = await commentService.remove(commentId)
    console.log('删除成功~')
    ctx.body = res
  }
  async list (ctx, next) {
    const { momentId } = ctx.query
    const res = await commentService.getCommentsByMomentId(momentId)
    ctx.body = res
  }
  async showcommentstatus (ctx, next) {
    console.log('showcommentstatus.....')
    const { id } = ctx.user
    let { offset = '1', size = '10' } = ctx.query
    // 如果不传就用默认值1和10
    offset = (offset - 1) * size
    offset = offset.toString()
    try {
      const res = await momentService.getCommentStatusByUserId(offset, size, id)
      let resData = {} //返回的data给前端
      if (!res.length == 0) {
        //如果找不到数据组是一个空数组
        resData.totalcount = res[0].count
        resData.results = res
      } else {
        // 返回为0
        resData = {
          totalcount: 0,
          results: []
        }
      }
      ctx.body = {
        message: 'OK',
        data: resData
      }
    } catch (error) {
      console.log(error)
    }
  }
  async updateMomentCanRepleyStatus (ctx, next) {
    const { momentId } = ctx.params
    const { allow_comment } = ctx.request.body
    await momentService.updateMomentReplyStatus(momentId, allow_comment)
    ctx.body = {
      status: '200',
      message: '修改状态成功~'
    }
  }
}

module.exports = new CommentController()
