# 待办事项管理系统

一个使用React、Express和SQLite数据库的待办事项（Todo List）管理系统，支持电脑端和手机端，并拥有用户认证功能。

## 功能特点

- 用户注册和登录功能，支持个人待办事项管理
- 创建、查看、编辑和删除待办事项
- 按状态、优先级和分类筛选待办事项
- 搜索待办事项
- 响应式设计，同时支持电脑和手机
- 使用SQLite数据库存储数据，易于部署和使用
- 完整的中文界面支持

## 系统详细介绍

### 核心功能
- **用户认证**：支持注册、登录和个人待办事项管理
- **待办事项管理**：轻松创建、编辑和删除任务
- **详细信息记录**：每个任务包含名称、描述、截止日期、优先级等完整信息
- **分类管理**：可自定义分类，便于任务组织和管理
- **状态追踪**：记录任务是未开始、进行中还是已完成
- **优先级标记**：支持低、中、高三级优先级标记
- **筛选功能**：可按多个维度（状态、优先级、分类）进行筛选
- **搜索功能**：快速查找任务

### 用户体验
- **个人空间**：每个用户拥有独立的待办事项管理界面
- **认证保护**：所有待办事项操作都需要用户登录
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
- JWT认证（JSON Web Token）

### 后端
- Node.js
- Express
- TypeScript
- SQLite（使用better-sqlite3）
- bcryptjs（密码加密）
- jsonwebtoken（JWT认证）

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
│       │   ├── TodoItem.tsx   # 待办事项项目组件
│       │   ├── Login.tsx      # 登录组件
│       │   ├── Register.tsx   # 注册组件
│       │   ├── Navbar.tsx     # 导航栏组件
│       │   └── PrivateRoute.tsx # 认证路由守卫组件
│       ├── services/     # API服务
│       │   └── todoService.ts # 待办事项API服务
│       ├── types/        # TypeScript类型定义
│       │   └── todo.ts   # 待办事项相关类型定义
│       ├── utils/        # 工具函数
│       └── contexts/     # React上下文
│           └── AuthContext.tsx # 认证上下文
├── server/               # 后端Express应用
│   ├── data/             # SQLite数据库文件目录
│   └── src/
│       ├── data/         # 数据访问层
│       │   ├── todoStore.ts  # 待办事项数据操作
│       │   └── userStore.ts  # 用户数据操作
│       ├── models/       # 数据模型
│       │   ├── todo.ts   # 待办事项模型定义
│       │   └── user.ts   # 用户模型定义
│       ├── controllers/  # 控制器层
│       │   ├── todoController.ts # 待办事项控制器
│       │   └── authController.ts # 认证控制器
│       ├── middleware/   # 中间件
│       │   └── auth.ts   # 认证中间件
│       └── routes/       # API路由
│           ├── todos.ts  # 待办事项路由
│           └── auth.ts   # 认证路由
└── package.json          # 根项目配置
```

## 认证功能

### 用户注册
用户可以通过注册页面创建新账号，需要提供以下信息：
- 用户名（唯一）
- 密码（长度至少6个字符）
- 电子邮箱（唯一）

### 用户登录
注册用户可以使用用户名和密码登录系统，成功登录后：
- 获取JWT令牌，用于后续API请求
- 跳转到个人待办事项管理页面

### 受保护的路由
系统使用JWT实现认证保护：
- 所有待办事项相关的API端点都受到认证保护
- 前端使用PrivateRoute组件保护需要登录才能访问的页面
- 认证状态通过AuthContext全局管理

## 组件详情

### Login和Register组件
登录和注册组件提供用户认证功能：
- 表单验证
- 错误处理和提示
- 响应式设计

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
- 用户ID（userId）：关联到创建者

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
- `JWT_SECRET`：JWT密钥（生产环境中应设置为强密钥）

## 数据持久化
所有数据（包括用户信息和待办事项）以SQLite数据库文件形式存储在`server/data`目录下。使用Docker部署时，数据通过卷(volume)进行持久化保存。

## API文档

### 认证API

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/profile` | GET | 获取当前用户信息（需要认证） |

### 待办事项API（所有接口都需要认证）

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/todos` | GET | 获取当前用户的所有待办事项 |
| `/api/todos/:id` | GET | 获取当前用户的单个待办事项 |
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