import express, { RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import todosRouter from './routes/todos';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// 中间件
app.use(cors());
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