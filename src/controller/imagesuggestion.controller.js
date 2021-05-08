const ImageSuggetsionService = require('../service/imagesuggestion.service')

class ImageSuggestionController {
  async GetImagesSuggByq (ctx, next) {
    const { q } = ctx.query;
    console.log("q:"+q)
    const res = await ImageSuggetsionService.getImageSuggestionbyQ(q);
    ctx.body = {
        status: '200',
        data: res[0]
    }
  }
}

module.exports = new ImageSuggestionController()
