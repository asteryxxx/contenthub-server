const pool = require('../app/database')

class ImageSuggetsionService {
    async getImageSuggestionbyQ(q) {
        const statement = `
          select JSON_ARRAYAGG(name)list
             from image_suggestion where name like ?
        `
        const res = await pool.execute(statement, ["%"+q+"%"])
        return res[0];
    }
}
module.exports = new ImageSuggetsionService()
