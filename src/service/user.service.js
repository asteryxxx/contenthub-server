const pool = require('../app/database')
const moment = require('moment')

class UserService {
    async create(user) {
        console.log('进入create user.....');
        const createDate = moment().format('YYYY-MM-DD HH:mm')
        const { name, password,telephone,sign,sex } = user;
        const statement = `insert into user (name,password,telephone,sign,createAt,sex) values (?,?,?,?,?,?)`;
        const res = await pool.execute(statement, [name, password,telephone,sign,createDate,sex])
        //将User存储到数据库中
        console.log('添加user数据成功..');
        return res[0];
    }
    async updateUser(user, id) {
        const { sex, sign } = user
        const statement = `UPDATE user SET sex = ?, sign = ? where id = ?`
        const res = await pool.execute(statement, [sex,sign,id])
        return res[0]
    }
    async getUserByName(name) {
        console.log('进入getUserByName.....');
        const statement = `SELECT * FROM USER WHERE NAME = ? `;
        const res = await pool.execute(statement, [name])
        // console.log(res);
        //这里res返回的数组，第一个下标为0的就是查到的结果（BinaryRow）
        /* service..getuserbyname..
            [
                [
                    BinaryRow {
                        id: 1,
                        name: 'zhh',
                        password: '123456',
                        createAt: null,
                        updateAt: 2021 - 01 - 28 T08: 48: 29.000 Z,
                        avatar_url: null
                    }
                ],
                [
                    ColumnDefinition { */
        return res[0];
        //所以我们返回第一个下标的元素即可
    }
    async updateAvatarUrlById(url, userId) {
        const statement = `update user set avatar_url =? where id = ?`;
        const [res] = await pool.execute(statement, [url, userId]);
        return res;
    }
    async getUserbyId(id) {
        const statement = `SELECT * FROM USER WHERE id = ? `;
        const [res] = await pool.execute(statement, [id])
        return res[0];
    }
    async getUserRecommendbyId(id) {
        const statement = `SELECT sign,avatar_url,name,id FROM USER WHERE id = ? `;
        const [res] = await pool.execute(statement, [id])
        return res[0];
    }
    async getExceptmyRecommends(id,offset, size) {
        const statement = `select count(1) over()'count',id,
name,sign,avatar_url from user where id!= ? limit ?,?`
        const res = await pool.execute(statement, [id,offset, size])
        return res[0]
    }
}

module.exports = new UserService();