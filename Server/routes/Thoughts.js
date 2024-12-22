var express = require('express');
var router = express.Router();
var { Thoughts } = require('../models');
var { Op } = require('sequelize');

/* GET home page. */
//获取所有thoughts
router.get('/', async function (req, res, next) {
    try {
        var query = req.query;
        var condition = {
            order: [
                ['createdAt', 'DESC']
            ]
        }
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }
        if (query.text) {
            condition.where = {
                text: {
                    [Op.like]: `%${query.text}%`
                }
            }
        }
        var thoughts = await Thoughts.findAll(condition);

        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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
//通过id获取单个thoughts
router.get('/:id', async function (req, res, next) {
    try {
        var thought = await Thoughts.findByPk(req.params.id);
        if (!thought) {
            return res.status(404).json({
                status: 'error',
                message: 'Thought not found'
            });
        }
        res.json({
            status: 'success',
            message: 'Thought fetched successfully',
            data: {
                thought
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



//删除thoughts
router.delete('/delete/:id', async function (req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Thought id is required'
            });
        }
        await Thoughts.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            status: 'success',
            message: 'Thought deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error
        });
    }
});

//更新thoughts
router.put('/:id', async function (req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Thought id is required'
            });
        }
        var thought = await Thoughts.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            status: 'success',
            message: 'Thought updated successfully',
            data: {
                thought
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
//获取同一天的thoughts
router.get('/day/:date', async function (req, res, next) {
    try {
        var date = req.params.date;
        if (!date) {
            return res.status(400).json({
                status: 'error',
                message: 'Date is required'
            });
        }

        // 计算日期的开始和结束时间
        var startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        var endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        var condition = {
            where: {
                startdate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['startdate', 'ASC']
            ]
        };

        var thoughts = await Thoughts.findAll(condition);
        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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
//添加 thought
router.post('/add', async function (req, res, next) {
    try {
        // 验证请求体中是否包含所有必要字段
        const { text, name, level, state, startdate, enddate, type } = req.body;
        if (!text || !name || !level || !state || !startdate || !enddate || !type) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        var thought = await Thoughts.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Thought created successfully',
            data: {
                thought
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
//通过level获取对应日期对应等级的thoughts
router.get('/level/:level', async function (req, res, next) {
    try {
        var level = req.params.level;
        if (!level) {
            return res.status(400).json({
                status: 'error',
                message: 'Level is required'
            });
        }

        // 计算当前日期的开始和结束时间 
        var startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        var endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        var condition = {
            where: {
                level: level,
                startdate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['startdate', 'ASC']
            ]
        };

        var thoughts = await Thoughts.findAll(condition);
        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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

//通过level获取对应日期对应等级的thoughts
router.get('/level/:level/:date', async function (req, res, next) {
    try {
        var level = req.params.level;
        var date = req.params.date;
        var requestedDate = new Date(date);

        // 将请求日期的后一天设置为开始日期
        var startOfNextDay = new Date(requestedDate);
        startOfNextDay.setDate(requestedDate.getDate() + 1);

        if (!level || !date) {
            return res.status(400).json({
                status: 'error',
                message: 'Level and date are required'
            });
        }


        var condition = {
            where: {
                level: level,
                enddate: { // 确保使用正确的字段名
                    [Op.gt]: requestedDate // endDate 大于请求日期
                },
                startdate: { // 确保使用正确的字段名
                    [Op.lt]: startOfNextDay
                }
            },
            order: [
                ['startdate', 'ASC']
            ]
        };

        var thoughts = await Thoughts.findAll(condition);
        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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
//通过state获取对应日期对应等级的thoughts
router.get('/state/:state/:date', async function (req, res, next) {
    try {
        var state = req.params.state;
        var level = req.params.level;
        var date = req.params.date;
        var requestedDate = new Date(date);

        // 将请求日期的后一天设置为开始日期
        var startOfNextDay = new Date(requestedDate);
        startOfNextDay.setDate(requestedDate.getDate() + 1);
        if (!state || !date) {
            return res.status(400).json({
                status: 'error',
                message: 'Level and date are required'
            });
        }


        var condition = {
            where: {
                state: state,
                enddate: { // 确保使用正确的字段名
                    [Op.gt]: requestedDate // endDate 大于请求日期
                },
                startdate: { // 确保使用正确的字段名
                    [Op.lt]: startOfNextDay
                }
            },
            order: [
                ['startdate', 'ASC']
            ]
        };

        var thoughts = await Thoughts.findAll(condition);
        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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

//获取结束日期在请求日期之后  开始日期在请求日期之前的thoughts // 假设你有一个 Thoughts 模型
router.get('/active/:date', async function (req, res, next) {
    try {
        var date = req.params.date;
        var requestedDate = new Date(date);

        // 将请求日期的后一天设置为开始日期
        var startOfNextDay = new Date(requestedDate);
        startOfNextDay.setDate(requestedDate.getDate() + 1);

        // 构建查询条件获取结束日期在请求日期之后，开始日期在请求日期的后一天的thoughts
        var condition = {
            enddate: { // 确保使用正确的字段名
                [Op.gt]: requestedDate // endDate 大于请求日期
            },
            startdate: { // 确保使用正确的字段名
                [Op.lt]: startOfNextDay
            }
        };

        var thoughts = await Thoughts.findAll({ where: condition });
        res.json({
            status: 'success',
            message: 'Active thoughts fetched successfully',
            data: {
                thoughts
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
//获取本月每一天的thoughts
router.get('/month/:date', async function (req, res, next) {
    try {
        var date = req.params.date;
        var requestedDate = new Date(date);

        // 计算本月的第一天和最后一天
        var firstDayOfMonth = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), 1);
        var lastDayOfMonth = new Date(requestedDate.getFullYear(), requestedDate.getMonth() + 1, 0);

        // 构建查询条件获取开始日期在本月第一天，结束日期在本月最后一天的thoughts
        var condition = {
            startdate: { // 确保使用正确的字段名
                [Op.gte]: firstDayOfMonth // startDate 大于等于本月第一天
            },
            enddate: { // 确保使用正确的字段名
                [Op.lte]: lastDayOfMonth // endDate 小于等于本月最后一天
            }
        };

        var thoughts = await Thoughts.findAll({ where: condition });
        res.json({
            status: 'success',
            message: 'Thoughts fetched successfully',
            data: {
                thoughts
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
//返回每日活动thoughts的个数
router.get('/active/count/:date', async function (req, res, next) {
    try {
        var date = req.params.date;
        var requestedDate = new Date(date);

        // 将请求日期的后一天设置为开始日期
        var startOfNextDay = new Date(requestedDate);
        startOfNextDay.setDate(requestedDate.getDate() + 1);

        // 构建查询条件获取结束日期在请求日期之后，开始日期在请求日期的后一天的thoughts
        var condition = {
            enddate: { // 确保使用正确的字段名
                [Op.gt]: requestedDate // endDate 大于请求日期
            },
            startdate: { // 确保使用正确的字段名
                [Op.lt]: startOfNextDay
            }
        };

        // 使用 count 方法获取活动日期的个数
        var count = await Thoughts.count({ where: condition });
        res.json({
            status: 'success',
            message: 'Active thoughts count fetched successfully',
            data: {
                count
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
