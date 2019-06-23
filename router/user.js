const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const moment = require('moment')



const conn = mysql.createConnection({
    host: '127.0.0.1',
    database: 'blogdata',
    user: 'root',
    password: 'root'
})


//注册
router.get('/register', (req, res) => {
    res.render('./user/register', {})
})


//登录
router.get('/login', (req, res) => {
    res.render('./user/login.ejs', {})
})


//注册新用户
router.post('/register', (req, res) => {


    //1接受前端的发送的post请求信息
    //2

    //完成注册的业务逻辑
    const body = req.body
    console.log(body);

    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({ msg: '请填写完整的表单数据后在注册用户', status: 501 })
    }

    //查询用户是否重复
    const sql1 = 'select count(*) as count from users where username=?'

    conn.query(sql1, body.username, (err, result) => {

        if (err) return res.send({ msg: '用户查重失败', status: 502 })

        if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名后重新注册', status: 503 })

        //执行注册的业务逻辑
        body.ctime = moment().format('YYY-MM-DD HH:mm:ss')
        const sql2 = 'insert into users set ?'
        conn.query(sql2, body, (err, result) => {
            if (err) return res.send({ msg: '注册新用户失败', status: 504 })

            if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败', status: 505 })
            res.send({ msg: 'ok', status: 200 })

        })

    })

})


//监听登录请求
router.post('/login', (req, res) => {
    // console.log(req.body);

    //1获取到表单中的数据
    const body = req.body

    //2执行sql语句，查询用户是否存在
    const sql1 = 'select * from users where username=? and password=?'

    conn.query(sql1, [body.username, body.password], (err, result) => {
        console.log(result);

        if (err) return res.send({ msg: '用户登录失败1', status: 501 })

        if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 501 })

        // 查询成功
        res.send({ msg: 'ok', status: 200 })
    })

})




module.exports = router