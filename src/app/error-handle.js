const errerTypes = require('../costants/error-types')

const errorHandler = (error, ctx) => {
    let status, message;
    // const errormess = new Error('用户名错误');
    //console.log(error.message);这里打印就是用户名错误
    switch (error.message) {
        case errerTypes.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400;
            message = '用户名/密码不能为空...';
            break;
        case errerTypes.USER_ALREADY_EXISTS:
            status = 409;
            message = '用户名已经存在...';
            break;
        case errerTypes.USER_DOES_NOT_EXISTS:
            status = 402;
            message = '用户名不存在...';
            break;
        case errerTypes.PASSWORD_IS_INCORRECT:
            status = 400;
            message = '密码不一致...';
            break;
        case errerTypes.TOKEN_ERROR:
            status = 401;
            message = 'token无效...';
            break;
        case errerTypes.BRING_TOKEN:
             status = 401;
             message = '请携带token...';
            break;
        case errerTypes.UNPERMISSION:
            status = 401;
            message = '你未具备操作的权限...';
            break;
        case errerTypes.UPLOADMOMENTCOVER_ERROR:
            status = 500;
            message = '上传图片失败~稍后再试';
            break;
        default:
            status = 404;
            message = '找不到页面...'
    }
    ctx.status = status;
    ctx.body = message;
}

module.exports = errorHandler;