#!/bin/sh

# 初始化数据库
echo "正在初始化数据库..."
node /app/server/init-db.js

# 启动服务器
echo "启动服务器..."
node /app/server/dist/index.js 