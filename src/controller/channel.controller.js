const channelService = require('../service/channel.service')

class ChannelController {
    async create(ctx, next) {
        const { name } = ctx.request.body;
        const res = await channelService.create(name);
        ctx.body = "创建标签成功~" + res
    }

    async list(ctx, next) {
        try {
            // let { limit, offset } = ctx.query;
            // //这边传参默认接受的字符串，然后我们修改之后要变为字符串变量再传
            // limit = (limit - 1) * offset;
            // limit = limit.toString();
            //不传就给默认值
             const res = await channelService.getChannels();
             ctx.body =  res
        } catch (error) {
             console.log(error);            
        }
    }
}

module.exports = new ChannelController();