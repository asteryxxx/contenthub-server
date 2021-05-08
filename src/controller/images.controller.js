const fileService = require('../service/file.service')
const imagesService = require('../service/images.service')
const fs = require('fs')
const { SUCAI_PATH } = require('../costants/file-path')
const path = require('path')
const formidable = require('formidable')
const sd = require('silly-datetime')
const mkdirp = require('mkdirp')
const errerTypes = require('../costants/error-types')
const { APP_PORT, APP_HOST } = require('../app/config')
const { reject } = require('lodash')

class ImagesController {
  //根据用户得到他所收藏的素材图片
  async GetImagesByUserId (ctx, next) {
    try {
      const { id } = ctx.user
      let { offset = '1', size = '12' } = ctx.query
      // 如果不传就用默认值1和2
      offset = (offset - 1) * size
      offset = offset.toString()
      const res = await imagesService.getImagesbyUserId(offset, size, id)
      let resData = {} //返回的data给前端
      if (!res.length == 0) {
        //如果找不到数据组是一个空数组
        resData.totalCount = res[0].count
        resData.results = res
      } else {
        // 返回为0
        resData = {
          totalCount: 0,
          results: []
        }
      }
      ctx.body = {
        message: 'OK',
        data: resData
      }
      /* ctx.body = {
        message: 'OK',
        data: {
          totalCount: res[0].count,
          result: res
        }
      } */
    } catch (error) {
      console.log(error)
    }
  }
  //上传素材
  upload = async (ctx, next) => {
    let url = APP_HOST + ':' + APP_PORT + '/images/sucai/'
    let newFilename = ''
    await mkdirp(SUCAI_PATH)
    const form = formidable({
      multiples: true
    })
    form.uploadDir = SUCAI_PATH //上传文件的保存路径
    form.keepExtensions = true //保存扩展名
    form.maxFieldsSize = 50 * 1024 * 1024 //上传文件的最大大小
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, async (err, fields, files) => {
        if (err) {
          //上传失败报错
          const errormess = new Error(errerTypes.UPLOADMOMENTCOVER_ERROR)
          return ctx.app.emit('error', errormess, ctx)
        }
        //从请求参数中提取到content内容
        let file = files.pic2
        let oldFilename = file.name
        let day = sd.format(new Date(), 'YYYYMMDD')
        newFilename = sd.format(new Date(), 'YYYYMMDD_HHmm_')
        newFilename =
          newFilename +
          Math.round(Math.random() * 1000) +
          path.extname(oldFilename)
        url = url + newFilename
        let dir = path.join(SUCAI_PATH, day)
        //mkdirp是异步方法，返回Promise
        //生成目录，必须存在
        await mkdirp(dir)
        fs.rename(file.path, path.join(dir, newFilename), err => {
          console.log('上传成功··')
        })
        await imagesService.createImages(newFilename, file.type, file.size)
        //插入到文件表
        ctx.body = {
          status: '200',
          message: '保存素材成功~',
          url
        }
        resolve()
      })
    })
  }
  //显示素材图片
  async showPic (ctx, next) {
    try {
      let filename = ctx.params.filename
      //获取文件名字
      const fileInfo = await imagesService.showPicbyfileName(filename)
      let day = sd.format(fileInfo.createAt, 'YYYYMMDD')
      let dir = path.join(SUCAI_PATH, day)
      //需要查出年月日，因为文件夹前面有
      ctx.response.set('content-type', fileInfo.mimetype)
      ctx.body = fs.createReadStream(`${dir}/${filename}`)
    } catch (error) {
      console.log(error)
    }
  }

  //顯示全部素材圖片
  async showAllPic (ctx, next) {
    const { id } = ctx.user
    let { offset = '1', size = '12' } = ctx.query
    offset = (offset - 1) * size
    offset = offset.toString()
    const res = await imagesService.findAllImages(id, offset, size)
    ctx.body = {
      message: 'OK',
      data: {
        totalCount: res[0].count,
        results: res
      }
    }
  }

  //收藏或取消收藏
  collectOpera = async (ctx, next) => {
    const { id } = ctx.user
    const { imageId } = ctx.params
    const { type } = ctx.query
    if (type === '0') {
      //取消收藏
      await imagesService.cancelCollect(id, imageId)
    } else {
      console.log('收藏')
      await imagesService.createImages_User(id, imageId)
    }
    ctx.body = {
      status: '200',
      message: `${type === '0' ? '取消收藏' : '收藏'}成功`
    }
  }
  deleteImageById = async (ctx, next) => {
    const { imageId } = ctx.params
    //查找文件并删除
    const { filename, createAt } = await imagesService.getImageById(imageId)
    await this.deleteFileImage(createAt, filename, imageId)
    ctx.body = {
      status: 'OK',
      message: '删除素材图片成功~'
    }
  }
  //删除素材文件
  async deleteFileImage (createAt, filename, imageId) {
    let day = sd.format(createAt, 'YYYYMMDD')
    let dir = path.join(SUCAI_PATH, day, filename)
    fs.unlink(dir, err => {
      if (err) throw err
      console.log('删除素材成功~')
    })
    await imagesService.deleteImageById(imageId)
  }
}

module.exports = new ImagesController()
