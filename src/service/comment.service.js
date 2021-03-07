const pool = require('../app/database')
const moment = require("moment");

class CommentService {
    async create(momentId, content, userid) {
        const createDate = moment().format('YYYY-MM-DD HH:mm');
        const statement = `
          insert into comment(moment_id, content, user_id, createAt) values( ? , ? , ? , ? )
        `
         const res = await pool.execute(statement, [momentId, content, userid, createDate])
         //将User存储到数据库中
         console.log('添加Comment数据成功..');
         return res[0];
    }
    async reply(momentId, content, commentId, userid) {
        const createDate = moment().format('YYYY-MM-DD HH:mm');
        const statement = `
          insert into comment(moment_id, content, user_id, createAt,comment_id) values( ? , ? , ? , ? ,?)
        `
        const res = await pool.execute(statement, [momentId, content, userid, createDate, commentId])
        //将User存储到数据库中
        console.log('添加Comment数据成功..');
        return res[0];
    }
     async update(commentId, content) {
         console.log('进入comment update方法...');
         const statement = `
          update comment set content = ? where id = ?
        `;
         const [res] = await pool.execute(statement, [content, commentId])
         console.log(res);
         return res;
    }
     async remove(commentId) {
         console.log('进入commentId remove方法...');
         const statement = `
          delete from comment where id = ?
        `;
         const [res] = await pool.execute(statement, [commentId])
         console.log(res);
         return res;
  }
  async getCommentsByMomentId(momentId) {
    //【/comment?momentId=1】
      console.log('进入getCommentsByMomentId方法...' + momentId);
       const statement = `
          SELECT
          m.id,
            m.content,
            m.comment_id commentId,
            m.createAt createTime,
            JSON_OBJECT('id', u.id, 'name', u.name) user
          FROM COMMENT m
          LEFT JOIN user u on u.id = m.user_id
          WHERE
          moment_id = ?
        `;
       const [res] = await pool.execute(statement, [momentId])
       return res;
    }
}

module.exports = new CommentService();