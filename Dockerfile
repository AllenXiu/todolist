FROM node:18-alpine AS build

WORKDIR /app

# 复制根目录package.json和package-lock.json
COPY package*.json ./

# 复制客户端和服务器端的package.json
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# 安装依赖
RUN npm ci && \
    cd client && npm ci && \
    cd ../server && npm ci

# 复制所有源代码
COPY . .

# 构建客户端和服务器端
RUN cd client && npm run build && \
    cd ../server && npm run build

# 生产环境镜像
FROM node:18-alpine

WORKDIR /app

# 安装wget用于健康检查
RUN apk add --no-cache wget

# 复制构建结果
COPY --from=build /app/package*.json ./
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package*.json ./server/

# 复制数据库初始化脚本和启动脚本
COPY --from=build /app/server/init-db.js ./server/
COPY --from=build /app/server/start.sh ./server/

# 给启动脚本添加执行权限
RUN chmod +x ./server/start.sh

# 安装生产环境依赖
RUN cd server && npm ci --production

# 创建数据存储目录并设置权限
RUN mkdir -p server/data && chmod 777 server/data

# 暴露端口
EXPOSE 5000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5000

# 启动命令，使用脚本先初始化数据库再启动服务
CMD ["/bin/sh", "server/start.sh"] 