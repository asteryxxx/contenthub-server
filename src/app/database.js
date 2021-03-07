const mysql = require('mysql2');

const config = require('./config');

const pool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    database: config.MYSQL_DATABASE,
    password: config.MYSQL_PASSWORD,
    port: config.MYSQL_PORT
});

pool.getConnection(function (err, conn) {
    conn.connect(err => {
        if (err) {
            console.log('链接失败',err);
        } else {
            console.log('链接成功');
        }
    })
})
module.exports = pool.promise();