const pool = require('../app/database')
const moment = require('moment')

const sqlFragment = `
              select count(1) over()
              'count', m.like_count, collect_count, m.id, m.content, m.title, DATE_FORMAT(m.createAt, '%Y-%m-%d %H:%i:%s') createAt, m.status,
                  group_concat(JSON_OBJECT('id', c.id, 'name', c.name))
              'channels',
              m.cover
              from moment m
              LEFT JOIN moment_channel mc ON m.id = mc.moment_id
              LEFT JOIN channel c ON mc.channel_id = c.id where 1 = 1 
`

class MomentService {
  async create (content, title, userId, cover, status) {
    console.log('进入create content.....' + status)
    const createDate = moment().format('YYYY-MM-DD HH:mm')
    // const createDate = '2021-01-28 16:48:29';
    const statement = `INSERT INTO moment (content, title, user_id,cover,status,createAt) VALUES (?,?,?,?,?,?);`
    const res = await pool.execute(statement, [
      content,
      title,
      userId,
      cover,
      status,
      createDate
    ])
    //将content存储到数据库中
    console.log('添加content数据成功..')
    return res[0]
  }

  async getMomentList (
    offset,
    size,
    status,
    channel_id,
    begin_pubdate,
    end_pubdate
  ) {
    let condition = ''
    const conditarr = []
    if (channel_id) {
      condition += ' and c.id = ? '
      conditarr.push(channel_id)
    }
    if (status) {
      condition += ' and m.status = ? '
      conditarr.push(status)
    }
    if (begin_pubdate && end_pubdate) {
      condition += 'and m.createAt between ? and ? '
      conditarr.push(begin_pubdate, end_pubdate)
    }
    const finalStatements = `
           ${sqlFragment}
           ${condition} 
           GROUP BY m.id 
           limit ? , ?
        `
    conditarr.push(offset, size)
    try {
      const res = await pool.execute(finalStatements, conditarr)
      return res[0]
    } catch (error) {
      console.log(error)
    }
  }

  async getMomentById (id) {
    console.log('进入getMomentById方法...')
    const statement = `
           		SELECT
           m.id, m.content, m.createAt, m.updateAt,m.title,m.status,
               JSON_OBJECT('id', u.id, 'name', u.NAME, 'avatarUrl', u.avatar_url) author,
               (SELECT IF(count(c.id),
                   JSON_ARRAYAGG(
                       JSON_OBJECT(
                           'id', c.id, 'content', c.content, 'commentId', c.comment_id,
                           'user', JSON_OBJECT('id', cu.id, 'name', cu.NAME, 'avatarUrl', cu.avatar_url))),
                   NULL) FROM COMMENT c LEFT JOIN USER cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,

               (SELECT count( * ) FROM COMMENT c WHERE c.moment_id = m.id) commentNum,
                   JSON_OBJECT('id', l.id, 'name', l.NAME) channel,

               (m.cover) cover
           FROM
           moment m
           LEFT JOIN USER u ON m.user_id = u.id
           LEFT JOIN moment_channel ml ON m.id = ml.moment_id
           LEFT JOIN channel l ON ml.channel_id = l.id
           WHERE
           m.id = ?
        `
    const res = await pool.execute(statement, [id])
    /* {
            "id": 3,
            "content": "jvm虚拟机这本书籍很好~~~",
            "createAt": "2021-01-28T08:48:29.000Z",
            "updateAt": "2021-01-30T14:01:31.000Z",
            "author": {
                "id": 3,
                "name": "zjt"
            }
        } */
    return res[0]
  }
  async updateMomentChannel(momentId, channelId) {
    console.log('进入moment updateCover方法...')
    const statement = `
              update moment_channel set channel_id = ? where moment_id = ?
            `
    const [res] = await pool.execute(statement, [channelId, momentId])
    return res
  }

  async  update(content, title, cover, status, momentId) {
    console.log('进入moment update方法...'+content, title, cover, status, momentId)
    const statement = `
          update moment set content = ?,title = ?,cover =? ,status =? where id = ?
        `
    const [res] = await pool.execute(statement, [content, title, cover, status, momentId])
    return res
  }

  async updateCover (cover, momentId) {
    console.log('进入moment updateCover方法...')
    const statement = `
          update moment set cover = ? where id = ?
        `
    const [res] = await pool.execute(statement, [cover, momentId])
    return res
  }

  async remove (momentId) {
    console.log('进入moment remove方法...')
    const statement = `
          update moment set status = 4 where id = ?
        `
    const [res] = await pool.execute(statement, [momentId])
    console.log(res)
    return res
  }

  async hasChannel (momentId, channelId) {
    const statement = `
          select * from moment_channel where moment_id = ? 
          and channel_id = ?
        `
    const [res] = await pool.execute(statement, [momentId, channelId])
    //查找某条数据的时候要返回res[0]
    return res[0]
  }

  async addChannel (momentId, channelId) {
    const createDate = moment().format('YYYY-MM-DD HH:mm')
    const statement = `INSERT INTO moment_channel (moment_id,channel_id,createAt) VALUES (?,?,?);`
    const res = await pool.execute(statement, [momentId, channelId, createDate])
    return res[0]
  }

  async getCommentStatusByUserId (offset, size, id) {
    console.log('getCommentStatusByUserId.....' + offset, size, id)
    const statement = `
        SELECT
	     count( 1 ) over () 'count',
	      m.title,
	     ( SELECT count(*) FROM COMMENT c WHERE c.moment_id = m.id ) totalComment,
      IF( m.comment_status = 1, 'true', 'false' ) CanComment 
         FROM
	    moment m   WHERE  m.user_id = ? 
	  LIMIT ?,?
      `
    const res = await pool.execute(statement, [id, offset, size])
    return res[0]
  }
  async updateMomentReplyStatus (momentId, allow_comment) {
    allow_comment = allow_comment === 'false' ? '0' : '1'
    const statment = `
       	update moment set comment_status = ? where id = ?
      `
    const res = await pool.execute(statment, [allow_comment, momentId])
    return res[0]
  }
}

module.exports = new MomentService()
