# 待办事项管理系统

一个使用React、Express和JSON存储的待办事项（Todo List）管理系统，支持电脑端和手机端。

## 功能特点

- 创建、查看、编辑和删除待办事项
- 按状态、优先级和分类筛选待办事项
- 搜索待办事项
- 响应式设计，同时支持电脑和手机
- 使用JSON文件存储数据，易于部署和使用
- 完整的中文界面支持

## 系统详细介绍

### 核心功能
- **待办事项管理**：轻松创建、编辑和删除任务
- **详细信息记录**：每个任务包含名称、描述、截止日期、优先级等完整信息
- **分类管理**：可自定义分类，便于任务组织和管理
- **状态追踪**：记录任务是未开始、进行中还是已完成
- **优先级标记**：支持低、中、高三级优先级标记
- **筛选功能**：可按多个维度（状态、优先级、分类）进行筛选
- **搜索功能**：快速查找任务

### 用户体验
- **响应式布局**：完美适配电脑和移动设备
- **直观操作**：简洁的用户界面，易于使用
- **实时反馈**：操作后立即显示结果
- **中文本地化**：界面完全中文化，包括日期选择器和状态展示

## 技术栈

### 前端
- React 18
- TypeScript
- React Router v6
- Material UI v5
- MUI X Date Pickers
- date-fns（含中文本地化支持）
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
│       │   ├── TodoList.tsx   # 待办事项列表组件
│       │   ├── TodoForm.tsx   # 待办事项创建/编辑表单组件
│       │   ├── TodoDetail.tsx # 待办事项详情组件
│       │   └── TodoItem.tsx   # 待办事项项目组件
│       ├── services/     # API服务
│       │   └── todoService.ts # 待办事项API服务
│       ├── types/        # TypeScript类型定义
│       │   └── todo.ts   # 待办事项相关类型定义
│       ├── utils/        # 工具函数
│       │   └── todoUtils.ts # 待办事项工具函数
│       └── contexts/     # React上下文
├── server/               # 后端Express应用
│   ├── data/             # JSON数据存储目录
│   └── src/
│       ├── data/         # 数据访问层
│       ├── models/       # 数据模型
│       └── routes/       # API路由
└── package.json          # 根项目配置
```

## 组件详情

### TodoForm组件
TodoForm是一个多功能组件，用于创建新的待办事项或编辑现有待办事项。

**主要特性：**
- 支持两种模式：创建模式和编辑模式
- 在编辑模式下自动加载现有待办事项数据
- 表单验证确保必填字段不为空
- 使用Material UI组件提供美观的用户界面
- 完整的中文本地化支持，包括表单标签和日期选择器
- 错误处理和加载状态显示
- 响应式设计，适配不同屏幕尺寸

**字段说明：**
- 名称：待办事项的标题（必填）
- 描述：详细说明（可选）
- 截止日期：任务完成期限（必填）
- 优先级：低、中、高（必填）
- 分类：用户自定义分类（必填）
- 状态：未开始、进行中、已完成（必填）

## 待办事项数据结构

每个待办事项包含以下信息：
- 名称（name）
- 描述（description）
- 截止日期（dueDate）
- 优先级（priority）：低（low）、中（medium）、高（high）
- 分类（category）
- 状态（status）：未开始（not_started）、进行中（in_progress）、已完成（completed）
- 创建时间（createdAt）
- 更新时间（updatedAt）
- ID（id）：唯一标识符

## 部署说明

### 常规部署
1. 克隆仓库：`git clone [仓库地址]`
2. 安装依赖：`npm run install-all`
3. 构建项目：`npm run build`
4. 启动服务器：`node server/dist/index.js`
5. 访问应用：`http://localhost:5000`

### Docker部署
项目支持使用Docker进行容器化部署，简化环境配置和部署过程。

#### 使用Dockerfile构建镜像
```bash
# 构建Docker镜像
docker build -t todo-app .

# 运行容器
docker run -p 3003:5000 -d --name todo-app todo-app
```

#### 使用Docker Compose部署
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量配置
- `PORT`：服务器端口，默认为5000
- `NODE_ENV`：运行环境，可选值为development或production

## 数据持久化
所有待办事项数据以JSON文件形式存储在`server/data`目录下。使用Docker部署时，数据通过卷(volume)进行持久化保存。

## API文档

### 待办事项API

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/todos` | GET | 获取所有待办事项 |
| `/api/todos/:id` | GET | 获取单个待办事项 |
| `/api/todos` | POST | 创建新待办事项 |
| `/api/todos/:id` | PUT | 更新待办事项 |
| `/api/todos/:id` | DELETE | 删除待办事项 |

## 浏览器兼容性
支持所有现代浏览器：
- Chrome
- Firefox
- Safari
- Edge

## 许可证

ISC 