# 待办事项管理系统

一个使用React、Express和JSON存储的待办事项（Todo List）管理系统，支持电脑端和手机端。

## 功能特点

- 创建、查看、编辑和删除待办事项
- 按状态、优先级和分类筛选待办事项
- 搜索待办事项
- 响应式设计，同时支持电脑和手机
- 使用JSON文件存储数据，易于部署和使用

## 技术栈

### 前端
- React
- TypeScript
- React Router
- Material UI
- Axios

### 后端
- Node.js
- Express
- TypeScript
- JSON文件存储

## 运行项目

### 安装依赖

```bash
# 安装所有依赖（根目录、服务器端和客户端）
npm run install-all
```

### 开发模式

```bash
# 同时启动前端和后端服务
npm start

# 仅启动后端
npm run server

# 仅启动前端
npm run client
```

### 构建项目

```bash
# 构建完整项目
npm run build

# 仅构建后端
npm run build:server

# 仅构建前端
npm run build:client
```

## 项目结构

```
todo-list/
├── client/               # 前端React应用
│   ├── public/
│   └── src/
│       ├── components/   # React组件
│       ├── services/     # API服务
│       ├── types/        # TypeScript类型定义
│       └── utils/        # 工具函数
├── server/               # 后端Express应用
│   ├── data/             # JSON数据存储目录
│   └── src/
│       ├── data/         # 数据访问层
│       ├── models/       # 数据模型
│       └── routes/       # API路由
└── package.json          # 根项目配置
```

## 待办事项数据结构

每个待办事项包含以下信息：
- 名称
- 描述
- 截止日期
- 优先级（低、中、高）
- 分类
- 状态（未开始、进行中、已完成）

## 许可证

ISC 