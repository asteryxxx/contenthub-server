function User(name) {
  this.name = name
}
/* console.dir(User)
console.log(User.prototype.__proto__ == Object.prototype);
// true
console.log(User.prototype.constructor == User)//true
let zs = new User.prototype.constructor('zhh');
*/
function CreateByObject(obj, ...args) {
  const constru = Object.getPrototypeOf(obj).constructor;
  console.log(args);//args是["zhh"]数组
  //...args就可以解构得到每个元素
  return new constru(...args)
}
let u1 = new User('u1')
let zhh = CreateByObject(u1,'zhh')
console.log(zhh);//User {name: "zhh"}

let a = { url: 'www.4399.com' }
let b = { name: 'pyy' }
// Object.prototype.web = '99999.com'
// console.log('web' in a);//true
// in不仅会检测在a对象上还会检测是否在a对象的原型链上出现
Object.setPrototypeOf(a, b);
// console.log('name' in a);//true
console.log(a.hasOwnProperty('name'));//false

let hd1 = {
  data: [1,3,5,7,9,8]
}
Object.setPrototypeOf(hd1, {
  max() {
    let data = arguments[0]
    console.log(typeof data)
    return data.sort((a, b) => b - a)[0]
  }
})
console.dir(hd1)
// console.log(hd1.max(hd1.data));

let dx2 = {
  lessons: { js: 80, php: 60, node: 90 },
/*   get data() {
    return Object.values(this.lessons)
    //Object.values()返回一个数组，其元素是在对象上找到的可枚举属性值
  } */
}
console.log(Object.values(dx2.lessons));
// console.log(hd1.max.apply(null,[1,3,5,7,9,2]));
// console.log(hd1.max.apply(dx2));
//因为hd1没有data属性,但是我们调用this.data会触发dx2的get 访问器属性
console.log('------------');
/* let uu = {
  name: 'uu',
  big(data) {
    console.dir(arguments);
    console.log(typeof data)
    console.log(data)
  }
}
console.log(uu.big.apply(null, [1, 3, 5, 7, 9, 8]))
//number 1
console.log(uu.big.call(null, [1, 3, 5, 7, 9, 8])) */
//object [1,3,5,7,9,8]
// console.log(Math.max.call(null, hd1.data));
// console.log(Math.max(...[1, 3, 5, 9]))

// function getMaxOfArray(numArray) {
//   console.log(Math.max.call(null,...numArray));
//   console.log(Math.max.apply(null, numArray))
// }
// getMaxOfArray([1, 2, 3])

let u3 = {name:'u3'}
u3.__proto__ = {
  show() {
    console.log('show...'+this.name);
  }
}
u3.__proto__ = 120
u3.show()
//可以发现还是可以正常执行打印，并没有受到赋值120的影响

let t1 = {
  action: {},
  get proto() {
    return this.action
  },
  set proto(obj) {
    if (obj instanceof Object) {
      //是对象才设置
      this.action = obj
    }
  }
}
t1.proto = { view: function () { } }
//{view: ƒ}
t1.proto = 'abb'//设置不进去
console.log(t1.proto);

let t2 = Object.create(null)//不继承原型，让原型为Null
t2.__proto__ = 'zhh'
console.dir(t2)
/* Object
  __proto__: 'zhh' */
