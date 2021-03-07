const errorType = require('./costants/error-types');
/* module.exports = {
    NAME_OR_PASSWORD_IS_REQUIRED
} */
console.log(errorType);
//{ NAME_OR_PASSWORD_IS_REQUIRED: 'name_or_password_is_required' }
console.log('========');
console.log(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
//name_or_password_is_required

const path = require('path')
const pathStr1 = path.resolve('./one', 'home', './d', '../f') 
//【\one\home\f】
console.log(pathStr1);
const pathStr2 = path.resolve('./one', 'home', './d/cc', '../f')
//【\one\home\d\f】
console.log(pathStr2);
/* 若以../ 开头，拼接前面路径，且不含最后一节路径。pathStr1中只有./ d 没有最后一节路径，
所以不包含./d进去；pathStr2的 ./d/cc包含最后一节路径，要去掉cc。输出结果自己对比下 */
const p3 = path.resolve('/ff/cc', './aa'); // 【/ff/cc/aa】
const p4 = path.resolve('/ff/cc', 'aa'); // 【/ff/cc/aa】
const p5 = path.resolve('/ff/cc', '/aa'); // 【/aa】
const p6 = path.resolve('/ff/cc', '../aa'); // 【/ff/aa】
const p7 = path.resolve('home', '/ff/cc', '../aa'); // 【/ff/aa】
const p8 = path.resolve('home', './ff/cc', '../aa'); // 【/home/ff/aa】
const p9 = path.resolve('home', 'ff/cc', '../aa'); // 【/home/ff/aa】
console.log(p3);
console.log(p4);
console.log(p5);
console.log(p6);
console.log(p7);
console.log(p8);
console.log(p9);

const moment = require("moment");
console.log('=====测试时间=====');
console.log(moment().format('YYYY-MM-DD HH:mm'));

let pa1 = '1612450042679.jpg';
let extname = pa1.substring(pa1.length - 4);
let headname = pa1.substring(0, pa1.length - 4);
console.log(`${headname}-large${extname}`);

/* let cover = {};
cover.type = 0;
cover.images = ['http://localhost:8888/moment/3/aa.jpg', 'http://localhost:8888/moment/3/bb.jpg'];
const jsobcover = JSON.stringify(cover);
console.log(jsobcover);

const obj = JSON.parse(jsobcover);
console.log(obj.images);
for (let picture of obj.images) {
    console.log(picture);
} */
console.log('=========test=============');
class MomentController { 
    async creat() {
        console.log(this);
    //    console.log(this.sayhi.bind(this)());
       /*  (async function() {
            console.log('creat....');
            console.log(this);
            const res = await this.t2();
            console.log(res);
        })(); */
    }
    async t2() {
        console.log('t2~~~~~~');
        return await this.sayhi();
    }
    sayhi() {
        console.log('sayhi::::');
        return "{'id':6}"
    }
}
new MomentController().creat();

let limit = 2;
let offset = 10;
 if (typeof limit == 'number') {
     console.log('是');
 }
console.log('---11---' + isNaN(limit));
limit = (limit - 1) * offset;
limit = limit.toString();
console.log('---22---' + isNaN(limit));
 if (typeof limit !== 'number') {
     console.log('不是');
}
console.log(isNaN(123));//false
console.log(isNaN("123"));//false 判断不了

console.log('======final=========');
let channel_id = 4;
const sqlFragment = `select * from teacher where 1=1 `
let condition = "";
let status = 1;
if (channel_id) {
    condition += ' and c.id = ? ';
}
if (status) {
   condition += ' and m.status = ? ';
}
const finalStatements = `
           ${sqlFragment}
           ${condition}
           limit ? , ?
        `;
console.log(finalStatements);
/* 
【动态加载所有的路由】
const obj = {
    name: 'zhh',
    hi: () => {
        console.log('obj的hi。。。。');
    }
}
const sayhi = function () {
    //这里用()=> 会找不到name属性，要用function
    console.log(this.name);
    console.log('sayhi...');
}
obj.sayhi = sayhi;
console.log(obj);
//{ name: 'zhh', hi: [Function: hi], sayhi: [Function: sayhi] }
//隐式绑定this
obj.sayhi(); 

【我们可以这样修改，不传app,让他隐式绑定】 ：
const useRoutes = function() {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') {
            return;
        } else {
            const router = require(`./${file}`);
            this.use(router.routes());
            this.use(router.allowedMethods())
        }
    })
}

const useRoutes = require('../router/index')
app.useRoutes = useRoutes;
//这样app就有了这个useRoutes方法，隐式绑定了this
app.useRoutes();
*/