const service = require('../service/user.service')
const fs = require('fs');
const { AVATAR_PATH } = require('../costants/file-path');
const FileService = require('../service/file.service');
const authService = require('../service/auth.service');
const userService = require('../service/user.service');
const errerTypes = require('../costants/error-types')

class UserController {
  async create(ctx, next) {
    //获取用户请求传递的参数
    const user = ctx.request.body;
    //查询数据
    const result = await service.create(user);
    //返回数据
    ctx.body = {
      status: 'OK',
      message:'添加用户成功~'
    };
  }
  async updateUser(ctx, next) {
    //获取用户请求传递的参数
    const user = ctx.request.body
    const {id} = ctx.user
    //查询数据
    await service.updateUser(user,id)
    //返回数据
    ctx.body = {
      status: 'OK',
      message: '修改用户信息成功~'
    }
  }
  async ListUsers(ctx, next) {
    ctx.body = '返回listuser....'
  }
  async avatarInfo(ctx, next) {
    //1、用户的头像是哪个文件
    const { userId } = ctx.params;
    const avatarInfo = await FileService.getAvatarByUseId(userId);
    // console.log(avatarInfo);
    //2、提供图片信息
    let AvamimeType = avatarInfo.mimetype; //读取图片文件类型
    ctx.response.set('content-type', AvamimeType); //设置返回类型
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.fileName}`)
    // 【./uploads/avatars/6145be864b】
  }
  async getUserProfile(ctx, next) {
    console.log('getUserProfile==========');
    try {
      const {id} = ctx.user;
      const useInfo = await userService.getUserbyId(id);
      ctx.body = useInfo;
    } catch (error) {
      const errormess = new Error(errerTypes.TOKEN_ERROR)
      return ctx.app.emit('error', errormess, ctx)
    }
  }
}

module.exports = new UserController();