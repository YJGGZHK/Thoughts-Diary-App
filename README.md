# Thoughts Diary

一个基于 Electron、Vue 3 和 Express 的桌面日记应用。

## 技术栈

- 前端：Electron + Vue 3 + TypeScript + Element Plus
- 后端：Express + Sequelize + MySQL


## 启动说明
1. 启动后端

先启动 MySQL 容器，
通过 `docker-compose up -d` 启动 MySQL 容器。
然后启动后端服务。
2. 启动前端
启动后端后跟据启动的地址和端口，修改前端API_BASE_URL环境变量。
然后启动前端
