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

# 复制构建结果
COPY --from=build /app/package*.json ./
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package*.json ./server/

# 安装生产环境依赖
RUN cd server && npm ci --production

# 创建数据存储目录
RUN mkdir -p server/data

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["node", "server/dist/index.js"] 