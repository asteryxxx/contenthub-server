const fileService = require('../service/file.service')
const momentService = require('../service/moment.service')
const fs = require('fs')
const { MOMENTS_PATH } = require('../costants/file-path')
const path = require('path')
const formidable = require('formidable')
const sd = require('silly-datetime')
const mkdirp = require('mkdirp')
const errerTypes = require('../costants/error-types')
const { APP_PORT, APP_HOST } = require('../app/config')

class MomentController {
  create = async (ctx, next) => {
    const { momentId } = ctx.params
    // 如果能获取到说明是更新
    const userId = ctx.user.id
    const article = ctx.request.body
    console.log(article)
    console.log('==============')
    let monId = '';
    let imagesPath = [];
    let imagesfilenames = []
    console.log(article)
    if (momentId) {
      console.log('更新')
      imagesPath = article.cover.imagesPath
      console.log("moment:")
      const moment = await momentService.getMomentById(momentId)
      console.log(moment)
      moment.cover = JSON.parse(moment.cover)
      console.log('moment.cover.imagesPath：'+moment.cover.imagesPath)
      if(moment.cover.imagesPath != 0){
        // 说明原来是有封面的
        //删除封面
        const list = await fileService.getCoverByMomentId(momentId)
        if (list) {
          await this.deleCoverPicList(list, momentId)
        }
      }
      // 判断修改后的是否无图还是有图
      if(article.cover.type != 0 ){
        console.log('提交的是有图。。')
        for (const img of imagesPath) {
          let index = img.lastIndexOf('/')
          let filename = img.substring(index + 1, img.length)
          await fileService.updateMomentIdbyfilename(momentId, filename)
        }
      }
      console.log('提交的是无图。。')
      article.cover = JSON.stringify(article.cover)
      await momentService.update(
        article.content,
        article.title,    
        article.cover,
        article.status,
        momentId
      )
      await momentService.updateMomentChannel(momentId, article.channel_id)
     
    } else {
      console.log('新建文字');
      imagesPath = article.cover.imagesPath
      article.cover = JSON.stringify(article.cover)
      const res = await momentService.create(article, userId)
      //插入成功会返回插入的id字段
      monId = res.insertId
      //4、给动态添加频道
      await momentService.addChannel(monId, article.channel_id)
      if (imagesPath.length!= 0) {
        // 说明有封面
        console.log('有封面')
        for (const img of imagesPath) {
          let index = img.lastIndexOf('/')
          let filename = img.substring(index + 1, img.length)
          await fileService.updateMomentIdbyfilename(monId, filename)
        }
      }
    }
    ctx.body = {
     status: '200',
     message: momentId ? '修改成功' : '发表成功~'
   }
   /*  const form = formidable({
      multiples: true
    })
    //获取到用户的id
    form.uploadDir = MOMENTS_PATH //上传文件的保存路径
    form.keepExtensions = true //保存扩展名
    // form.multiples = true; //多个同名文件
    form.maxFieldsSize = 50 * 1024 * 1024 //上传文件的最大大小
    try {
      const imagesPath = []
      let laterfile = {}
      let monId = ''
      let channelId = ''
      form.parse(ctx.req, async (err, fields, files) => {
        if (err) {
          //上传失败报错
          const errormess = new Error(errerTypes.UPLOADMOMENTCOVER_ERROR)
          return ctx.app.emit('error', errormess, ctx)
        }
        //1、从fields获取表单提交的json数据
        const { content, title, type, channel_id, status = '2' } = fields
        //从请求参数中提取到content内容
        channelId = channel_id
        let cover = { type, imagesPath }
        switch (fields.type) {
          case '0':
            console.log('存的无图....')
            //给cover对象赋值属性并转为json对象
            cover = JSON.stringify(cover)
            //判断更新还是插入
            if (momentId) {
              console.log('进入无图更新的逻辑....')
              //说明要更新
              await momentService.update(
                content,
                title,
                cover,
                status,
                momentId
              )
              await momentService.updateMomentChannel(momentId, channelId)
              //如果原来有封面就要删除
              const list = await fileService.getCoverByMomentId(momentId)
              await this.deleCoverPicList(list, momentId)
              break
            }
            //2、将数据插入到数据库中
            const res = await momentService.create(
              content,
              title,
              userId,
              cover,
              status
            )
            //插入成功会返回插入的id字段
            monId = res.insertId
            //4、给动态添加频道
            await momentService.addChannel(monId, channelId)
            break
          case '1':
            console.log('存的有图~~~')
            //3、上传文件
            //files可以取到上传的文件，然后.pic2是name属性，如果传了多个是数组[ File {..},File {..}]
            laterfile = await this.settingForm(files, laterfile, imagesPath)
            //给cover对象赋值属性并转为json对象
            cover = JSON.stringify(cover)
            //【"http://localhost:8888/moments/images/20210215_1609_156.png"】
            //判断更新还是插入
            if (momentId) {
              console.log('进入有封面图更新的逻辑....')
              //说明要更新
              const list = await fileService.getCoverByMomentId(momentId)
              await this.deleCoverPicList(list, momentId)
              //删除所有封面，然后更新文章内容
              await momentService.update(
                content,
                title,
                cover,
                status,
                momentId
              )
              //插入封面到表中
              await fileService.createFile(
                laterfile.filename,
                laterfile.type,
                laterfile.size,
                userId,
                momentId
              )
              //更新频道
              await momentService.updateMomentChannel(momentId, channelId)
              break
            }
            //2、将数据插入到数据库中
            const res1 = await momentService.create(
              content,
              title,
              userId,
              cover,
              status
            )
            //插入成功会返回插入的id字段
            monId = res1.insertId
            console.log('monID:'+monId)
            await fileService.createFile(
              laterfile.filename,
              laterfile.type,
              laterfile.size,
              userId,
              monId
            )
            //4、给动态添加频道
            await momentService.addChannel(monId, channelId)
            break
          default:
            console.log('error...')
        }
      }) */
      ctx.body = {
        status: '200',
        message: momentId ? '修改成功' : '发表成功~'
      }
  }
  //生成新的文件名，并上传文件
  async settingForm (files, laterfile, imagesPath) {
    let file = files.pic2
    let oldFilename = file.name
    let day = sd.format(new Date(), 'YYYYMMDD')
    let newFilename = sd.format(new Date(), 'YYYYMMDD_HHmm_')
    newFilename =
      newFilename + Math.round(Math.random() * 1000) + path.extname(oldFilename)
    let dir = path.join(MOMENTS_PATH, day)
    //mkdirp是异步方法，返回Promise
    //生成目录，必须存在
    await mkdirp(dir)

    fs.rename(file.path, path.join(dir, newFilename), err => {
      console.log('上传成功··')
    })
    laterfile = {
      filename: newFilename,
      type: file.type,
      size: file.size
    }
    imagesPath.push(APP_HOST + ':' + APP_PORT + '/moment/images/' + newFilename)
    return laterfile
  }

  async detailById (ctx, next) {
    try {
      console.log('detailById~~~~~~')
      //1、获取到动态的id
      const momentId = ctx.params.momentId
      //获取动态路由传值【'/:momentId'】：要通过ctx.params
      //2、根据id去查询这条数据
      const res = await momentService.getMomentById(momentId)
      //这里的res是返回数组
      ctx.body = {
        message: 'OK',
        data: res
      }
    } catch (error) {
      console.log(error)
    }
  }

  async list (ctx, next) {
    try {
      //传过来的地址是：/moment/list?offset=1&size=10
      let {
        offset = '1',
        size = '5',
        status,
        channel_id,
        begin_pubdate,
        end_pubdate
      } = ctx.query
      offset = (offset - 1) * size
      offset = offset.toString()
      //查询列表
      const res = await momentService.getMomentList(
        offset,
        size,
        status,
        channel_id,
        begin_pubdate,
        end_pubdate
      )
      let resData = {} //返回的data给前端
      if (!res.length == 0) {
        //如果找不到数据组是一个空数组
        resData.totalcount = res[0].count
        resData.results = res
      } else {
        // 返回为0
        resData = {
          totalcount: 0,
          results: []
        }
      }
      ctx.body = {
        message: 'OK',
        data: resData
      }
      //因为查到的结果是多条，所以不用取第0个。
    } catch (error) {
      console.log(error)
    }
  }

  async remove (ctx, next) {
    //1、获取momentId
    const { momentId } = ctx.params
    //2、删除内容
    const res = await momentService.remove(momentId)
    ctx.body = {
      status: 'OK',
      message: '删除成功'
    }
  }

  DeleteMomentCover = async (ctx, next) => {
    console.log('DeleteMomentCover.....')
    //1、获取momentId
    const momentId = ctx.params.momentId
    const list = await fileService.getCoverByMomentId(momentId)
    await this.deleCoverPicList(list, momentId)
    ctx.body = {
      status: 'OK',
      message: '删除封面成功'
    }
  }

  async deleCoverPicList (list, momentId) {
    for (let img of list) {
      console.log(img.filename)
      let day = sd.format(img.createAt, 'YYYYMMDD')
      let dir = path.join(MOMENTS_PATH, day, img.filename)
      fs.unlink(dir, err => {
        if (err) throw err
        console.log('删除封面成功~')
      })
      await fileService.deleteCoverByMomentId(img.id)
    }
    await momentService.updateCover('{"type":"0","imagesPath":[]}', momentId)
  }

  async addChannels (ctx, next) {
    console.log('进入addchannelss方法....')
    //因为我们在上一个中间件赋值了： ctx.labels = newLabels
    //1、获取标签和动态Id
    const { channels } = ctx
    const { momentId } = ctx.params
    //2、添加所有的标签
    for (let channel of channels) {
      try {
        //2.1、判断标签是否和动态已经有关系了？
        const isExist = await momentService.hasChannel(momentId, channel.id)
        console.log(isExist)
        if (!isExist) {
          //不存在关系
          await momentService.addChannel(momentId, channel.id)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    ctx.body = {
      statusCode: 200,
      message: '给动态添加标签成功~'
    }
  }

  async fileInfo (ctx, next) {
    let { filename } = ctx.params
    //获取文件名字
    const fileInfo = await fileService.getFileByfilename(filename)
    console.log(fileInfo)
    let day = sd.format(fileInfo.createAt, 'YYYYMMDD')
    let dir = path.join(MOMENTS_PATH, day)
    console.log(dir);
    //需要查出年月日，因为文件夹前面有
    //【uploads\moments\images\20210204】
    const { type } = ctx.query //如果对方在链接上有传tpye的传值
    const types = ['small', 'middle', 'large']
    if (types.some(item => item === type)) {
      //【some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试】
      let extname = filename.substring(filename.length - 4) //.jpg
      let oldheadname = filename.substring(0, filename.length - 4)
      let newheadname = oldheadname + '-' + type
      //【1612451939631-small.jpg】
      //1612451939631就是oldheadname，然后1612451939631-small就是newheadname
      filename = newheadname + extname
      console.log(filename)
      //【http://localhost:8888/moment/images/1612451939631.jpg?type=middle】
      //这样就能访问到1612451939631-middle.jpg这个图片
    }
    ctx.response.set('content-type', fileInfo.mimetype)
    ctx.body = fs.createReadStream(`${dir}/${filename}`)
  }

  async getHomemomentList(ctx, next) {
    try {
      const res = await momentService.getHomemomentList();
      let arr1 = [1, 3, 4, 5, 13, 14];
      let newArr = [];
      for (let i = 0; i < arr1.length; i++){
          newArr[i] = res.filter(item => item.cid === arr1[i])
      }
      ctx.body = {
        status: '200',
        data: newArr
      }
    } catch (error) {
      console.log(error);        
    }
  }

  async getHotmomentList(ctx, next) {
    let {
      offset = '1',
      size = '5',
    } = ctx.query
    offset = (offset - 1) * size
    offset = offset.toString()
    const res = await momentService.getHotmomentList(offset,size);
    ctx.body = {
      status: '200',
      data: res
    }
  }

  async getChannelmomentListMore(ctx, next) {
     let {
      offset = '1',
      size = '5',
      cid
    } = ctx.query
    offset = (offset - 1) * size
    offset = offset.toString()
    const res = await momentService.ChannelmomentListMore(cid,offset,size);
    ctx.body = {
      status: '200',
      data: res
    }
  }

  async searchbyquery(ctx, next) {
    console.log('[[[[[search....');
    let {
      offset = '1',
      size = '5',
      q
    } = ctx.query
    offset = (offset - 1) * size
    offset = offset.toString()
    const res = await momentService.searchbyquery(q, offset, size);
    ctx.body = {
      status: 200,
      data: res
    }
  }
}

module.exports = new MomentController()
