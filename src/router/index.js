//【动态加载所有的路由】
const fs = require('fs');
//console.log(__dirname);   \src\router
const useRoutes = (app) => {
    //因为我们要app.use 所以需要传入一个app的参数
    fs.readdirSync(__dirname).forEach(file => {
        //遍历当前目录，得到每个文件auth.router.js 、index.js..
        if (file === 'index.js') {
            return;
        } else {
            const router = require(`./${file}`);
            //注册路由
            app.use(router.routes());
            app.use(router.allowedMethods())
        }
    })
}
module.exports = useRoutes;
