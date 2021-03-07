const pool = require('../app/database')

class AuthService {
  //通用方法：检测用户有无权限
  async checkResource(tableName, id, userId) {
    //select * from comment where id = 1 and user_id = 3 ;
    //select * from moment where id = ? and user_id = ? ;
    //我们可以发现只有表名是变的，后面的都是不变的。如果查询到记录说明有权限更改
     console.log('进入checkResource方法。。。。');
      try {
        const statement = `
              select * from ${tableName} where id = ? and user_id = ? ;
            `;
        const [res] = await pool.execute(statement, [id, userId])
        //如果数组等于0说明找不到，不具备权限的，返回true
        console.log(res.length);
        return res.length === 0 ? true : false;
      } catch (error) {
        console.log(error);
      }
  }
    async checkMoment(momentId, userId) {
       console.log('进入checkMoment方法。。。。');
       
    }
}

module.exports = new AuthService();