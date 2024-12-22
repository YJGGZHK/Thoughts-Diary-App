var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { sequelize } = require('./models'); // 引入 sequelize 实例

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var thoughtsRouter = require('./routes/Thoughts');
var countdowndaysRouter = require('./routes/Countdowndays');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var corsOptions = {
    origin: 'http://localhost:1010', // 只允许来自 http://example.com 的请求
    optionsSuccessStatus: 200 // 一些旧版浏览器对 204 状态码的处理有问题
};

app.use(cors(corsOptions));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/thoughts', thoughtsRouter);
app.use('/countdowndays', countdowndaysRouter);
// 同步数据库
// sequelize.sync({ alter: true }) // 或者使用 { force: true } 进行强制同步
//     .then(() => {
//         console.log('数据库已同步');
//     })
//     .catch(err => {
//         console.error('同步数据库时出错:', err);
//     });
module.exports = app;
