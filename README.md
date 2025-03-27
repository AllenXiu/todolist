# Todo List 待办事项管理系统

## 项目简介
这是一个使用现代Web技术栈构建的待办事项管理系统。

### 技术栈
- 前端：React + TypeScript
- 后端：Express + TypeScript
- 数据存储：JSON文件存储
- 开发工具：Docker支持

## 功能特点
- 添加、编辑、删除待办事项
- 标记待办事项完成状态
- 响应式设计，支持移动端
- Docker容器化部署

## 项目结构
```
├── client/                 # 前端代码
│   ├── src/               
│   │   ├── components/    # React组件
│   │   ├── contexts/      # React上下文
│   │   ├── services/      # API服务
│   │   ├── types/         # TypeScript类型定义
│   │   └── utils/         # 工具函数
│   └── public/            # 静态资源
├── server/                 # 后端代码
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   ├── models/        # 数据模型
│   │   └── data/          # 数据存储
│   └── prisma/            # Prisma配置
├── docker-compose.yml      # Docker编排配置
└── Dockerfile             # Docker构建文件
```

## 快速开始

### 本地开发
1. 安装依赖：
```bash
npm run install-all
```

2. 启动开发服务器：
```bash
npm start
```

3. 访问应用：
- 前端页面：http://localhost:3000
- 后端API：http://localhost:5000

### Docker部署
1. 构建镜像：
```bash
docker-compose build
```

2. 启动容器：
```bash
docker-compose up -d
```

## 开发命令
- `npm start`: 同时启动前端和后端服务
- `npm run server`: 仅启动后端服务
- `npm run client`: 仅启动前端服务
- `npm run build`: 构建前端和后端代码
- `npm run install-all`: 安装所有依赖

## 贡献指南
1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证
本项目采用 ISC 许可证 