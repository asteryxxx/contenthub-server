const pool = require('../app/database')
const moment = require('moment')

class UserfocusService {
    async getshowfollowList(offset, size, id) {
      const statement = `
      select count(1) over()'count', u.id 'id',
 u.name 'name' ,  u.avatar_url 'avatar_url',u.sign 'sign', 1 'isfollowing'
from user_focus uf
left JOIN  user u
on uf.focus_user_id = u.id
where user_id = ?
order by uf.createAt desc
limit ? ,?
        `
      const res = await pool.execute(statement, [id,offset, size])
      return res[0]
    }
    async getshowfansList(offset, size, id) {
      const statement = `
      select count(1) over()'count', u.id 'id',u.name 'name' ,  u.avatar_url 'avatar_url',u.sign 'sign', if(
(SELECT COUNT(*) FROM user_focus uf1  where uf1.user_id = uf.user_id and uf1.focus_user_id = 3)
+
(SELECT COUNT(*)  FROM user_focus uf2  where uf2.user_id = 3 and uf2.focus_user_id = uf.user_id) = 1,'关注','互相关注')status
from user_focus uf ,user u
where
uf.user_id = u.id and focus_user_id = ?
order by uf.createAt desc 
limit ? , ?
        `
      const res = await pool.execute(statement, [id,offset, size])
      return res[0]
    }
    async getshowrecommendsList(id) {
      const statement = `
      select distinct B.focus_user_id from user_focus A
         INNER JOIN user_focus B on A.focus_user_id = B.user_id
         LEFT JOIN user_focus C on B.focus_user_id = C.focus_user_id AND C.user_id = ?
         where A.user_id = ? and B.focus_user_id != ?
         AND C.focus_user_id is NULL 
        `
      const res = await pool.execute(statement, [id,id,id])
      return res[0]
    }
    async getUserfocusbyuserId(id) {
        const statement = `
          select * from user_focus uf where uf.user_id = ?  `
        const [res] = await pool.execute(statement, [id])
        return res[0]
    }
    async deletefanbyId(id, fanid) {
       const statement = `
          DELETE FROM  user_focus uf where uf.user_id = ? and uf.focus_user_id = ? `
          const res = await pool.execute(statement, [id, fanid])
          return res[0]
    }
    async followuser(id, fanid) {
        const createDate = moment().format('YYYY-MM-DD HH:mm')
        const statement = `insert into user_focus (user_id,focus_user_id,createAt) values (?,?,?)`
        const res = await pool.execute(statement, [id, fanid,createDate])
        return res[0]
    }

}
module.exports = new UserfocusService()
