import express, { RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import todosRouter from './routes/todos';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// 配置CORS中间件
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],  // 允许的前端源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],         // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization'],            // 允许的请求头
  credentials: true,                                            // 允许携带凭证(cookies)
  optionsSuccessStatus: 200                                     // 预检请求的状态码
};

// 中间件
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../client/build')));

// API 路由
app.use('/api/todos', todosRouter);

// 处理前端路由
app.get('*', ((req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
}) as RequestHandler);

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器正在运行，端口：${PORT}`);
}); 