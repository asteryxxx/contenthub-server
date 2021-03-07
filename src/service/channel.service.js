const pool = require('../app/database')
const moment = require("moment");

class ChannelService {
    async create(name) {
        const createDate = moment().format('YYYY-MM-DD HH:mm');
        const statement = `
          insert into channel(name, createAt) values( ? , ? )
        `
        const res = await pool.execute(statement, [name, createDate])
        console.log('添加channel数据成功..');
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
}
module.exports = new ChannelService();