const crypto = require('crypto');

const md5password = (password) => {
    const md5 = crypto.createHash('md5');
    const res = md5.update(password).digest('hex');
    //hex:签名通常用一个十六进制的字符串
    return res;
}

module.exports = md5password;