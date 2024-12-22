# Electron、Vue 3 和 Vite 构建的桌面应用程序

## 项目结构

- **构建和打包工具**：Electron Forge
- **开发服务器和构建工具**：Vite
- **前端框架**：Vue 3
- **编程语言**：TypeScript

## 主要配置文件

- `package.json`：定义项目依赖和脚本
- `forge.config.ts`：Electron Forge 配置
- `vite.renderer.config.ts`：Vite 渲染进程配置
- `vite.main.config.ts`：Vite 主进程配置
- `vite.preload.config.ts`：Vite 预加载脚本配置
- `tsconfig.json`：TypeScript 配置

## 主要源文件

- `src/main.ts`：Electron 主进程入口
- `src/preload.ts`：预加载脚本
- `src/renderer.ts`：渲染进程入口
- `src/App.vue`：Vue 主组件

## 特点

- **UI 组件库**：Element Plus
- **自动导入和组件自动注册**
- **代码检查**：ESLint
- **支持热重载和热重启

## 构建和打包

- **支持平台**：Windows、macOS、Linux
- **安全配置**：Electron Fuses

## 渲染进程

- **用户界面构建**：Vue 3
- **组件示例**：App.vue 中包含 Element Plus 组件

## 主进程

- **主窗口创建和管理**：应用生命周期管理
- **页面加载**：根据开发/生产环境加载不同页面

## 开发工具

- **开发工具配置**：TypeScript、ESLint
- **自定义构建配置**：Vite 插件系统

