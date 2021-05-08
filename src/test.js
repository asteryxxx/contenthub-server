const errorType = require('./costants/error-types')
/* module.exports = {
    NAME_OR_PASSWORD_IS_REQUIRED
} */
console.log(errorType)
//{ NAME_OR_PASSWORD_IS_REQUIRED: 'name_or_password_is_required' }
console.log('========')
console.log(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
//name_or_password_is_required

const path = require('path')
const pathStr1 = path.resolve('./one', 'home', './d', '../f')
//【\one\home\f】
console.log(pathStr1)
const pathStr2 = path.resolve('./one', 'home', './d/cc', '../f')
//【\one\home\d\f】
console.log(pathStr2)
/* 若以../ 开头，拼接前面路径，且不含最后一节路径。pathStr1中只有./ d 没有最后一节路径，
所以不包含./d进去；pathStr2的 ./d/cc包含最后一节路径，要去掉cc。输出结果自己对比下 */
const p3 = path.resolve('/ff/cc', './aa') // 【/ff/cc/aa】
const p4 = path.resolve('/ff/cc', 'aa') // 【/ff/cc/aa】
const p5 = path.resolve('/ff/cc', '/aa') // 【/aa】
const p6 = path.resolve('/ff/cc', '../aa') // 【/ff/aa】
const p7 = path.resolve('home', '/ff/cc', '../aa') // 【/ff/aa】
const p8 = path.resolve('home', './ff/cc', '../aa') // 【/home/ff/aa】
const p9 = path.resolve('home', 'ff/cc', '../aa') // 【/home/ff/aa】
console.log(p3)
console.log(p4)
console.log(p5)
console.log(p6)
console.log(p7)
console.log(p8)
console.log(p9)

const moment = require('moment')
console.log('=====测试时间=====')
console.log(moment().format('YYYY-MM-DD HH:mm'))

let pa1 = '1612450042679.jpg'
let extname = pa1.substring(pa1.length - 4)
let headname = pa1.substring(0, pa1.length - 4)
console.log(`${headname}-large${extname}`)

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
console.log('=========test=============')
class MomentController {
  async creat () {
    console.log(this)
    //    console.log(this.sayhi.bind(this)());
    /*  (async function() {
            console.log('creat....');
            console.log(this);
            const res = await this.t2();
            console.log(res);
        })(); */
  }
  async t2 () {
    console.log('t2~~~~~~')
    return await this.sayhi()
  }
  sayhi () {
    console.log('sayhi::::')
    return "{'id':6}"
  }
}
new MomentController().creat()

/* let limit = 2
let offset = 10
if (typeof limit == 'number') {
  console.log('是')
}
console.log('---11---' + isNaN(limit))
limit = (limit - 1) * offset
limit = limit.toString()
console.log('---22---' + isNaN(limit))
if (typeof limit !== 'number') {
  console.log('不是')
}
console.log(isNaN(123)) //false
console.log(isNaN('123')) //false 判断不了 */

console.log('======final=========')
/* let channel_id = 4
const sqlFragment = `select * from teacher where 1=1 `
let condition = ''
let status = 1
if (channel_id) {
  condition += ' and c.id = ? '
}
if (status) {
  condition += ' and m.status = ? '
}
const finalStatements = `
           ${sqlFragment}
           ${condition}
           limit ? , ?
        `
console.log(finalStatements) */
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

【什么是隐式绑定呢，如果函数调用时，前面存在调用它的对象，那么this就会隐式绑定到这个对象上，看个例子：
function fn() {
    console.log(this.name);
};
let obj = {
    name: '听风是风',
    func: fn
};
obj.func() //听风是风】


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

// ["http://localhost:8888/moment/images/20210308_1357_343.jpg"]}

console.log('======================')
/* let array = [ 1,3,4,5,13,14 ]
let sqlstr = 'SELECT * FROM channel where id in ('
let tempstr = ''
for (let i = 0; i < array.length; i++){
  tempstr += '?,'
}
sqlstr = (sqlstr + tempstr);
sqlstr = sqlstr.substring(0,sqlstr.length-1) + ')'
console.log(sqlstr); */

/* let potentiallyNullObj = null
let x = 0
let prop = potentiallyNullObj?.[x++]
console.log(x) // x 将不会被递增，依旧输出 0

let customer = {
  name: "Carl",
  details: { age: 82 }
};
let customerCity = customer?.city ?? "暗之城";
console.log(customerCity); // “暗之城” */

const ROLES = {
  GUEST: 0,
  USER: 1,
  ADMIN: 2
}
const ROLE_METHODS = {
  [ROLES.GUEST] () {
    console.log('guest...')
  },
  [ROLES.USER] () {
    console.log('user...')
  },
  [ROLES.ADMIN] () {
    console.log('ADMIN...')
  }
}
const userRole = '1'
ROLE_METHODS[userRole]()

const list1 = [
  { id: '1', name: 'java', flag: 'true' },
  { id: '2', name: 'c++', flag: 'true' },
  { id: '3', name: 'php', flag: 'true' }
]
const allList = [
  { id: '1', name: 'java', flag: 'true'},
  { id: '2', name: 'c++', flag: 'true' },
  { id: '3', name: 'php', flag: 'true' },
  { id: '4', name: 'vb', flag: 'false' },
  { id: '5', name: '前端', flag: 'false' }
]


// let rs5 = []
// let obj5 = []
// rs5 = allList.reduce((prev, cur) => {
//   obj5[cur.id] ? '' : obj5[cur.id] = true && prev.push(cur)
//   return prev;
// }, [])
// console.log(rs5);

console.log('============')

let add = allList.filter(item =>
  !list1.some(ele => ele.id === item.id))
  //如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测
console.log(add)

const Settemp = new Set(list1.map(item => item.id))
//这里打印一下Settemp:Set { '1', '2', '3' }
const newfinalArr = allList.filter(item => {
  return !(Settemp.has(item.id))
})
console.log(newfinalArr);


var reg4 = /(<\/?font.*?>)|(<\/?span.*?>)|(<\/?a.*?>)|(<\/?p.*?>)|(<\/?img.*?>)|((<\/?strong.*?>))/gi
var str =
  '<p><strong><em>今天天气很好哦。</em>这是我拍的图片</strong><img src="http://localhost:8888/moment/images/1614670754862.jpg" alt="" title="" width="200" data-display="inline"></p>'
console.log(str.replace(reg4, ''))

if(3>1){
  try {
    console.log('111');
  } catch (error) {
    console.log('222');
  } finally {
    console.log('finally')
    return
  }
  console.log('4444');
  return ;
}
console.log('false');

