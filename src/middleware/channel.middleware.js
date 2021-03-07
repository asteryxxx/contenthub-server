const errerTypes = require('../costants/error-types');
const channelService = require('../service/channel.service');

const verifyChannelExists = async (ctx, next) => {
    //1、取出要添加的所有标签
    const {
        channels
    } = ctx.request.body;
    //2、判断每一个标签在lable表中是否存在
    const newChannels = [];
    for (let name of channels) {
        const channelResult = await channelService.isExistChannelByname(name);
        //如果没找到就是undefined
        const channel = {
            name
        }
        if (!channelResult) {
            //没找到标签就创建标签，添加到数组里去
            const res = await channelService.create(name);
            //插入成功会返回插入的id字段
            channel.id = res.insertId;
        } else {
            //说明找到了标签，直接赋值找到的标签的id即可
            channel.id = channelResult.id;
        }
        newChannels.push(channel);
     /*    [
         { name: '前端', id: 1 },
         { name: 'it', id: 5 },
         ...
        ] */
    }
    console.log(newChannels);
    
    ctx.channels = newChannels
    //处理完要next();
    console.log('处理完verifychannelExists中间件~~~');
    await next();
}
module.exports = {
    verifyChannelExists
}