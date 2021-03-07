class Person {
  sayhi () {
    console.log('hi...')
  }
}
const { sayhi } = new Person()
sayhi()

const [res, ...tail] = [
  { id: '01', name: 'zhh' },
  { id: '02', name: 'lx' },
  { id: '03', name: 'zjt' }
]
//这样解构，就取到第一个元素的
console.log(res) //{ id: '01', name: 'zhh' }
console.log('-----')
console.log(tail)
//[ { id: '02', name: 'lx' }, { id: '03', name: 'zjt' } ]

console.log('===test json-bigint====')
const JSONbig = require('json-bigint')

const str = '{"id":9223372036854775807}'
console.log(JSON.parse(str))
console.log(JSONbig.parse(str).id.toString())

const obj2 = {
  a: {
    b: {
      c: 123
    }
  }
}
console.log(obj2.a.b.c)
//多层解构
const {
  a: {
    b: { c }
  }
} = obj2
console.log(c)

/* const p1 = new Promise((resolve, reject) => {
  setTimeout(function () {
    console.log('执行完成Promise')
    resolve('要返回的数据可以任何数据例如接口返回数据')
  }, 2000)
})
p1.then(res => {
  console.log(res)
})
console.log('main执行了~~~~')
 */

async function sayhello () {
  return 'hello'
}

/* const rr = await (() => {
  return new Promise(async resolve => {
    const str = await sayhello()
    console.log(str)
    console.log('到我了吗？')
    resolve('666')
  })
})()
console.log('main6666----')
rr.then(res => {
  console.log(res)
}) */

function resolveAfter2Seconds () {
  return new Promise(resolve => {
    resolve('200....')
  })
}
async function create () {
  console.log('create......')
  let str = ''
  const str2 = await new Promise(resolve => {
    ;(async () => {
      console.log('111111')
      const result = await resolveAfter2Seconds()
      console.log('2222:' + result)
      str = result
      console.log('3333:' + str)
      resolve(str)
      //这里一定要resolve ,不然99999后面那里的代码打印不到
      //await会一直等待promise执行完毕,就必须要resolve
    })()
  })
  console.log('999999999:' + str2)
}
create()

/* async function create () {
  console.log('create......')
  let str = ''
  const f1 = (async () => {
    console.log('111111')
    const result = await resolveAfter2Seconds()
    str = result
    console.log('里面了:' + str)
    return str
  })()
  const rs = await f1
  console.log('开始前...', f1)
  console.log('出来了:' + rs)
}
create() */
console.log("------")

let arr = [3,4,10]
array.forEach(ele => {
  ele = ele+","
});
// let sql = `select * from user where id in (${shuzu})`
// console.log(sql);