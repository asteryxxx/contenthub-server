function User (name, age) {
  this.name = name
  this.age = age
}
const Credit = {
  total () {
    console.log('total...')
  }
}
const Request = {
  ajax () {
    console.log('ajax')
  }
}
function Admin (name, age) {
  User.call(this, name, age)
}
function extend (sub, sup) {
  sub.prototype = Object.create(sup.prototype)
  Object.defineProperty(sub.prototype, 'constructor', {
    value: sub,
    enumerable: false
  })
}
extend(Admin, User)
//因为Admin.prototype就是一个对象，我们可以把功能（其实就是属性）
//压到Admin.prototype就可以了。
Admin.prototype = Object.assign(Admin.prototype, Request, Credit)
console.dir(Admin)
let ad1 = new Admin('zjt', 55)
ad1.total()
ad1.ajax()




var CachedSearchBox = (function(){    
    var cache = {},    
       count = [];    
    return {    
       attachSearchBox : function(dsid){    
           if(dsid in cache){//如果结果在缓存中    
              return cache[dsid];//直接返回缓存中的对象    
           }    
           var fsb = new uikit.webctrl.SearchBox(dsid);//新建    
           cache[dsid] = fsb;//更新缓存    
           if(count.length > 100){//保正缓存的大小<=100    
              delete cache[count.shift()];    
           }    
           return fsb;          
       },    
 
       clearSearchBox : function(dsid){    
           if(dsid in cache){    
              cache[dsid].clearSelection();      
           }    
       }    
    };    
})();    
 
CachedSearchBox.attachSearchBox("input");

clickHandle: function(item){
  if(typeof item.checked === 'undefined'){
   this.$set(item, 'checked', true)
  } else {
   item.checked = !item.checked
  }
}
// 如果item没有checked属性就用set方法添加，有则取反
