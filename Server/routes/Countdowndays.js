var express = require('express');
var router = express.Router();
var { Countdownday } = require('../models');
var { Op } = require('sequelize');


//获取全部数据
router.get('/', async function (req, res, next) {
    try {
        var query = req.query;
        var condition = {
            order: [
                ['startday', 'DESC']
            ]
        }

        var countdowndays = await Countdownday.findAll(condition);

        res.json({
            status: 'success',
            message: 'countdowndays fetched successfully',
            data: {
                countdowndays
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});
router.get('/:id', async function (req, res, next) {
    try {
        var countdowndays = await Countdownday.findByPk(req.params.id);
        if (!countdowndays) {
            return res.status(404).json({
                status: 'error',
                message: 'countdowndays not found'
            });
        }
        res.json({
            status: 'success',
            message: 'countdowndays fetched successfully',
            data: {
                countdowndays
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});

//通过id删除countdownday
router.delete('/delete/:id', async function (req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Countdownday id is required'
            });
        }
        await Countdownday.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            status: 'success',
            message: 'Countdownday deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});

//更新countdownday
router.put('/put/:id', async function (req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Countdownday id is required'
            });
        }
        var Countdowndays = await Countdownday.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            status: 'success',
            message: 'Countdownday updated successfully',
            data: {
                Countdowndays
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});
//添加 countdownday
router.post('/add', async function (req, res, next) {
    try {
        // 验证请求体中是否包含所有必要字段
        const { content, startday, endday, type, istop, ishow } = req.body;
        if (!content || !istop || !ishow || !startday || !endday || !type) {
            return res.status(400).json({

                status: 'error',
                message: 'All fields are required'
            });
        }

        var Countdowndays = await Countdownday.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Countdownday created successfully',
            data: {
                Countdowndays
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message, // 添加错误信息
            error: error
        });
    }
});



// 获取istop为false or true 的countdownday


router.get('/istop/:istop', async function (req, res, next) {
    try {
        var condition = {
            where: {
                istop: req.params.istop === 'true' // 根据传入的参数动态设置条件
            },
            order: [
                ['startday', 'DESC']
            ]
        };

        var countdowndays = await Countdownday.findAll(condition);

        res.json({
            status: 'success',
            message: 'Countdowndays with istop fetched successfully',
            data: {
                countdowndays
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});

module.exports = router;