const pool = require('../app/database')
const moment = require("moment");

class ImagesService {
    async findAllImages(id,offset,size){
      const statement = `
         SELECT
	 count(1) over()'count', ig.id 'img_id',
	 concat( 'http://localhost:8888/images/sucai/', ig.filename )'url'
	,
	if((select ui.image_id from user_image ui where ig.id = ui.image_id and ui.user_id = ?),"true","false")isCollected
    FROM
	images ig
    WHERE
		ig.type = 2 
    limit ?,?
      `
      const res = await pool.execute(statement, [id,offset,size])
      return res[0];
    }
    async getImagesbyUserId(offset, size, id) {
        console.log('getImagesbyUserId.....'+offset, size, id);
        const statement = `
         SELECT
	count(1) over()'count',
	ig.id 'img_id',
  concat( 'http://localhost:8888/images/sucai/', ig.filename )'url',
	if(ig.id,'true','false')'isCollected'
FROM
	images ig
LEFT JOIN user_image ui on ig.id = ui.image_id	
WHERE
 ui.user_id = ?
limit ?,?
        `;
        const res = await pool.execute(statement, [id,offset,size])
        // console.log(res[0]);
        return res[0];
    }
    async createImages(filename, mimetype, size,type) {
        const createDate = moment().format('YYYY-MM-DD HH:mm');
        const statement = `INSERT INTO images (filename, mimetype, size,createAt) VALUES (?,?,?,?);`;
        const res = await pool.execute(statement, [filename, mimetype, size, createDate])
        console.log('添加素材数据成功..');
        return res[0];
    }
    async createImages_User(user_id,image_id){
        const createDate = moment().format('YYYY-MM-DD HH:mm');
        const statement = `INSERT INTO user_image (user_id,image_id,createAt) VALUES (?,?,?);`;
        const res = await pool.execute(statement, [user_id,image_id, createDate])
        console.log('添加Images_User数据成功..');
        return res[0];
    }
    async showPicbyfileName(filename){
        const statement = `SELECT * FROM images WHERE filename = ? `;
        const [res] = await pool.execute(statement, [filename])
        return res[0];
    }
    async cancelCollect(userid, imageId) {
       const statement = `DELETE FROM user_image WHERE user_id =? and image_id = ? `
       const [res] = await pool.execute(statement, [userid, imageId])
       return res[0]
    }
   
    async getImageById(id) {
       const statement = `
          select * from images where id = ?
        `
        const [res] = await pool.execute(statement, [id])
        return res[0]
    }
    async deleteImageById(id){
      const statement = `
          delete from images where id = ?
        `
      const res = await pool.execute(statement, [id])
      return res[0]
    }
}

module.exports = new ImagesService();