console.log(num);
//undefined
var num = 10;

f1();//正常运行
function f1() {
    console.log('f1....');
}
f2();
//TypeError: f2 is not a function
var f2 = function () {
    console.log('f2...');
}