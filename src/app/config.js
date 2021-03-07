const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();
/*  方法1：
let { APP_PORT } = process.env;
console.log(APP_PORT);
方法2：
console.log(process.env.APP_PORT); 
*/
const PRIVATE_KEY = fs.readFileSync('./src/app/keys/private.key');
//因为我们在contenthub 目录下进行nodemon ./src/main.js
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, "./keys/public.key"));
//用绝对路径也行。
module.exports = {
   APP_HOST,
   APP_PORT,
   MYSQL_HOST,
   MYSQL_PASSWORD,
   MYSQL_PORT ,
   MYSQL_USER ,
   MYSQL_DATABASE,
} = process.env;
//这里导出用的就是方法1
module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY

// console.log(module.exports);//他是一个对象{ APP_PORT: '8888'...}
// 所以导出私钥和公钥要写在后面，不然他导出常量的时候 = {...}赋值了新的对象，
//写前面会覆盖掉公钥私钥