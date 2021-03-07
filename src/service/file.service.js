const pool = require('../app/database')
const moment = require('moment')

class FileService {
  async createAvatar (filename, mimetype, size, userId) {
    const createDate = moment().format('YYYY-MM-DD HH:mm')
    const statement = `
          insert into avatar(fileName, mimetype, size, user_id, createAt) values( ? , ? , ? , ?,? )
        `
    const res = await pool.execute(statement, [
      filename,
      mimetype,
      size,
      userId,
      createDate
    ])
    console.log('添加file数据成功..')
    return res[0]
  }
  async updateAvatar (filename, mimetype, size, userId, avaId) {
    const statement = `
          update avatar set fileName = ? , mimetype = ? , size = ? , user_id = ? where id = ?
        `
    const res = await pool.execute(statement, [
      filename,
      mimetype,
      size,
      userId,
      avaId
    ])
    console.log('修改头像数据成功..')
    return res[0]
  }
  async getAvatarByUseId (userId) {
    const statement = `
           SELECT * from avatar WHERE user_id = ?
        `
    const [res] = await pool.execute(statement, [userId])
    return res[0]
  }
  async createFile (filename, mimetype, size, userId, momentId) {
    if (!momentId) {
      momentId = null
    }
    const createDate = moment().format('YYYY-MM-DD HH:mm')
    const statement = `
          insert into file(fileName, mimetype, size, user_id,moment_id, createAt) values( ? , ? , ? , ?,?,? )
        `
    const res = await pool.execute(statement, [
      filename,
      mimetype,
      size,
      userId,
      momentId,
      createDate
    ])
    console.log('添加file数据成功..')
    return res[0]
  }
  async getFileByfilename (filename) {
    const statement = `
           SELECT * from file WHERE filename = ?
        `
    const [res] = await pool.execute(statement, [filename])
    return res[0]
  }
  async getCoverByMomentId (momentId) {
    //因为我可能不止一个封面
    const statement = `
           SELECT * from file WHERE moment_id = ?
        `
    const [res] = await pool.execute(statement, [momentId])
    return res
  }
  async deleteCoverByMomentId (momentId) {
    const statement = `
          delete from file where id = ?
        `
    const res = await pool.execute(statement, [momentId])
    console.log('删除封面数据成功..')
    return res[0]
  }
}

module.exports = new FileService()
