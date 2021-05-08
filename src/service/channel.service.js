const pool = require('../app/database')
const moment = require("moment");

class ChannelService {
  async create(name) {
    const createDate = moment().format('YYYY-MM-DD HH:mm');
    const statement = `
          insert into channel(name, createAt) values( ? , ? )
        `
    const res = await pool.execute(statement, [name, createDate])
    console.log('添加channel数据成功');
    return res[0];
  }
  async isExistChannelByname(name) {
    const statement = `
          select * from channel where name = ?
        `
    const [res] = await pool.execute(statement, [name])
    console.log(res[0]);
    //如果有数据就返回true
    return res[0];
  }
  async getChannels() {
    //因为ctx.query默认传过来的是字符，如果我们改变了数值要转为字符串
    const statement = `
          select id, name from channel ORDER BY id 
        `;
    const [res] = await pool.execute(statement, [])
    return res;
  }
  async getNologinList(array) {
    let sqlstr = 'SELECT id,name FROM channel where id in ('
    let tempstr = ''
    for (let i = 0; i < array.length; i++) {
      tempstr += '?,'
    }
    sqlstr = sqlstr + tempstr
    sqlstr = sqlstr.substring(0, sqlstr.length - 1) + ')'
    const [res] = await pool.execute(sqlstr, array)
    return res
  }
  async getUserchannel(userId) {
    const statement = `
         select id,name from channel c,user_channel uc where c.id = uc.channel_id
         and uc.user_id = ? ORDER BY uc.createAt
        `
    const [res] = await pool.execute(statement, [userId])
    return res
  }
  async deleteUserchannel(userId, channelId) {
    const statement = `
         DELETE from user_channel uc where uc.user_id = ? and uc.channel_id = ?
        `
    const [res] = await pool.execute(statement, [userId, channelId])
    return res
  }
  async createUserchannel(userId, channelId) {
    const statement = `
          insert into user_channel(user_id,channel_id)values(?,?)
        `
    const [res] = await pool.execute(statement, [userId, channelId])
    return res
  }

  async deleteAllchannelbyuserId(userId) {
    const statement = `
          delete from user_channel where user_id = ?
        `
    const [res] = await pool.execute(statement, [userId])
    return res
  }
}
module.exports = new ChannelService();