const FileService = require('../service/file.service')
const {
    AVATAR_PATH
} = require('../costants/file-path');
const {
    APP_PORT,
    APP_HOST
} = require('../app/config')
const UserService = require('../service/user.service')
const MomentService = require('../service/moment.service')
const path = require('path')
const fs = require('fs')

class FileController {
    //保存图像相关的信息。
    async saveAvatarInfo(ctx, next) {
        const id = ctx.params.userId
        console.log(id)
        //1、获取图像相关的信息
        // console.log(ctx.req.file);
        //可以获取到文件的信息
        const {
            mimetype,
            filename,
            size
        } = ctx.req.file;
        //2、将图像信息保存到数据库中
        // const { id } = ctx.user
        //去file表中查询有无用户id上传过的头像
        const AvaInfo = await FileService.getAvatarByUseId(id);
        if (!AvaInfo) {
            console.log('没上传过头像~~');
            await FileService.createAvatar(filename, mimetype, size, id)
        } else {
            const dir = path.join(AVATAR_PATH, AvaInfo.fileName)
            // 删除之前的头像
            console.log(dir);
            fs.unlink(dir,(error)=>{
                if(error){
                    console.log('删除头像失败~');
                    return false;
                }
                console.log('删除头像文件成功');
            })
            console.log('上传过，更新头像~~');
            await FileService.updateAvatar(filename, mimetype, size, id,AvaInfo.id)
        }
        //3、把图片的路径存到user表中
        const avaUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
        //【http://localhost:8888/users/3/avatar】
        console.log(avaUrl);
        await UserService.updateAvatarUrlById(avaUrl, id);
        //4、返回结果
        ctx.body = {
            status: "200",
            data: {
              url:avaUrl  
            }
        };
    }
    async saveMomentInfo(ctx, next) {
        //【{{BaseURL}}/upload/moments?momentId=1】
        //1、获取图片信息
        const files = ctx.req.files;
        const { id } = ctx.user;
        const { momentId } = ctx.query;
        const imagesPath = [];
        let cover = {
            type:0,
            imagesPath
        }
        //2、将所有文件信息保存到数据库中
        for (let file of files) {
            // console.log(file);
            const {
                mimetype,
                filename,
                size
            } = file;
             await FileService.createFile(filename, mimetype, size, id, momentId)
            imagesPath.push(APP_HOST + ":" + APP_PORT + "/moment/images/" + filename);
        }
        cover.type = (files.length).toString();
        cover = JSON.stringify(cover);
        await MomentService.updateCover(cover, momentId);
        //上传配图记得要更新动态的cover字段
        ctx.body = '上传动态配图成功~~~~'
    }

    async saveDraftPic(ctx,next) {
       const files = ctx.req.files;
       console.log(files.length)
       const { id } = ctx.user;
        let url = '';
        let urls = [];
        if (files.length === 1) {
          const { mimetype, filename, size } = files[0]
          await FileService.createFile(filename, mimetype, size, id)
          url = (APP_HOST + ":" + APP_PORT + "/moment/images/" + filename)
          urls.push(url)
        } else {
            for (const ff of files) {
                console.log(ff)
                await FileService.createFile(ff.filename, ff.mimetype, ff.size, id)
                url = APP_HOST + ':' + APP_PORT + '/moment/images/' + ff.filename
                urls.push(url)
            }
        }
       ctx.body = {
            statusCode: 200,
            message:'用户上传草稿圖成功~',
            url: urls
        };
    }
}

module.exports = new FileController();