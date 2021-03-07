const userfocusService = require('../service/userfocus.service');
const userService = require('../service/user.service')

class UserfocusController {
    //展示用户的关注列表
    async showfollow(ctx, next) {
        const { id } = ctx.user
        let {
            offset = '1',
            size = '5',
        } = ctx.query
        offset = (offset - 1) * size
        offset = offset.toString()
        console.log(id,offset,size);
        //查询列表
        const res = await userfocusService.getshowfollowList(
            offset,
            size,
            id
        )
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
          status: 'OK',
          data: resData
        }
    }
    //展示粉丝列表
    async showfans(ctx, next) {
      const { id } = ctx.user
      let { offset = '1', size = '5' } = ctx.query
      offset = (offset - 1) * size
      offset = offset.toString()
    //查询列表
      const res = await userfocusService.getshowfansList(offset, size, id)
        //返回数据
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
      status: 'OK',
      data: resData
    }
    }
    //展示推荐用户列表
    async showrecommends(ctx, next) {
      const { id } = ctx.user
      let { offset = '1', size = '5' } = ctx.query
      offset = (offset - 1) * size
      offset = offset.toString()
      let arr = [];
      let res = null;
      let rr = null;
      //查询列表
      //如果没有关注用户,则展示全部
      const rs1 = await userfocusService.getUserfocusbyuserId(id);
      if (!rs1) {
          console.log('没关注过');
         // 说明用户是新用户，没关注过一个人，推荐除了他自己的其余用户
          rr = await userService.getExceptmyRecommends(id, offset, size)
          arr = rr;
      } else {
          //如果有关注走这个逻辑
          res = await userfocusService.getshowrecommendsList(offset, size, id)
          for (const Row of res) {
            arr.push(await userService.getUserRecommendbyId(Row.focus_user_id))
          }
      }
        //返回数据
      let resData = {} //返回的data给前端
      if (!arr.length == 0) {
        //如果找不到数据组是一个空数组
        resData.totalcount = !rs1 ? rr[0].count: res.length
        resData.results = arr
      } else {
      // 返回为0
      resData = {
        totalcount: 0,
        results: []
      }
    }
        ctx.body = {
          status: 'OK',
          data: resData
        }
    }
    //移除粉丝
    async deletefan(ctx, next) {
        const { userId } = ctx.params;
        const { id } = ctx.user;
        await userfocusService.deletefan(id,userId)
        ctx.body = {
          status: 'OK',
          message:'移除成功~'
        }
    }
    //关注用户
    async followuser(ctx, next) {
        const { userId } = ctx.params;
        const { id } = ctx.user;
        await userfocusService.followuser(id,userId)
        ctx.body = {
          status: 'OK',
          message:'关注用户成功~'
        }
    }
}
module.exports = new UserfocusController()