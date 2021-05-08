const channelService = require('../service/channel.service')

class ChannelController {
    async create(ctx, next) {
        const { name } = ctx.request.body;
        const res = await channelService.create(name);
        ctx.body = "创建标签成功~" + res
    }
    async addUserchannel(ctx, next) {
        try {
            console.log('addUserchannel....');
            const { channelId } = ctx.request.body
            const { id } = ctx.user
            await channelService.createUserchannel(id,channelId)
            ctx.body = {
                status: 200,
                data: `用户：${id} 添加频道${channelId}成功`
            }
        } catch (error) {
            console.log(error);            
        }
    }

    async list(ctx, next) {
        try {
             const res = await channelService.getChannels();
             ctx.body =  res
        } catch (error) {
             console.log(error);            
        }
    }

    async nologinlist(ctx, next) {
        try {
            console.log("nologinlist....")
            let nologinarray = [1, 3, 4, 13, 14]
            const res = await channelService.getNologinList(nologinarray)
            ctx.body = {
              status: '200',
              data: res
            }
        } catch (error) {
            console.log(error)
        }
    }
    async loginbyUser(ctx, next){
         try {
              console.log(ctx.query)
              const res = await channelService.getUserchannel(ctx.query.userId)
              ctx.body = {
                status: '200',
                data: res
              }
         } catch (error) {
             console.log(error);            
         }
    }
    async deleteChannelByuserId(ctx, next) {
        const { id } = ctx.user
        let { deletArr } = ctx.request.body
        deletArr = JSON.parse(deletArr)
        await channelService.deleteAllchannelbyuserId(id);
        for (let item of deletArr) {
            //添加剩下的id，记得要先删除用户的原先全部频道
            await channelService.createUserchannel(id,item)
        }
        ctx.body = {
            status: '200',
            data: '删除频道成功.'
        }
    }
}

module.exports = new ChannelController();