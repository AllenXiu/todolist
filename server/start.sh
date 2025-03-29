#!/bin/sh

# 设置错误时退出
set -e

# 打印环境变量（不包含敏感信息）
echo "环境配置："
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "JWT_SECRET: ${JWT_SECRET:+已设置}"
echo "TOKEN_EXPIRY: $TOKEN_EXPIRY"

# 检查必要的环境变量
if [ -z "$JWT_SECRET" ]; then
    echo "错误: JWT_SECRET 环境变量未设置"
    exit 1
fi

# 初始化数据库
echo "正在初始化数据库..."
node /app/server/init-db.js

# 检查数据库初始化是否成功
if [ $? -ne 0 ]; then
    echo "错误: 数据库初始化失败"
    exit 1
fi

# 启动服务器
echo "启动服务器..."
exec node /app/server/dist/index.js 