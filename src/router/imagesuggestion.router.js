const Router = require('koa-router')
const ImagesSuggestionRouter = new Router({ prefix: '/imageSuggestion' })

const {
  GetImagesSuggByq
} = require('../controller/imagesuggestion.controller')

ImagesSuggestionRouter.get('/', GetImagesSuggByq)
module.exports = ImagesSuggestionRouter
