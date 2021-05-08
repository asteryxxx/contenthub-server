const Multer = require('koa-multer');
const {
    AVATAR_PATH, MOMENTS_PATH
} = require('../costants/file-path');
const path = require('path');
const jimp = require('jimp');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');
const avatarUpload = Multer({
    dest: AVATAR_PATH
});

/* const testupload = Multer({
    dest: './uploads/moments'
}) */

const Momentstorage = Multer.diskStorage({
    //destination 其实还是字符串和 (req,file,callback)=>{}
    destination: async (req, file, cb) =>{
        let day = sd.format(new Date(), 'YYYYMMDD');
        let dir = path.join(MOMENTS_PATH, day);
        //生成目录，必须存在
        console.log(dir);
        //mkdirp是异步方法，返回Promise
        await mkdirp(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname);
        cb(null, Date.now()+"_"+Math.floor(Math.random()*100000)+extname);
    }
})
const Momentupload = Multer({
    storage: Momentstorage
});
const MomentHandler = Momentupload.array('moments', 9);
const avatarHandler = avatarUpload.single('avatar');

const PictureResize = async (ctx, next) => {
    //1、获取所有图像的信息
    const files = ctx.req.files;
    //2、对图像进行处理（sharp/jimp）
        for (let file of files) {
            //【destination: 'uploads\\moments\\images\\20210204'】
            //这里的路径已经有日期的前缀了
            //【path: 'uploads\\moments\\images\\20210204\\1612450042679.jpg'】
            let extname = file.filename.substring(file.filename.length - 4);
            //取到后缀名和没裁剪之前的名字
            let headname = file.filename.substring(0, file.filename.length - 4);
            const destpath = path.join(file.destination, headname);
            console.log(destpath);
            //【uploads\moments\images\20210204\1612451845204】
             jimp.read(file.path).then(image => {
                //  resize的第二个参数是高度，auto是等比适应的高度，第一个参数是宽度
                 image.resize(1280, jimp.AUTO).write(`${destpath}-large${extname}`);
                 image.resize(640, jimp.AUTO).write(`${destpath}-middle${extname}`);
                 image.resize(320, jimp.AUTO).write(`${destpath}-small${extname}`);
            })   
    }
     await next();
}

module.exports = {
    avatarHandler,
    MomentHandler,
    PictureResize
}