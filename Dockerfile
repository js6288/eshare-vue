# 使用 Node 14 作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制应用程序依赖项清单
COPY package*.json ./

# 安装应用程序依赖项
RUN npm install

# 复制应用程序代码
COPY . .

# 构建应用程序
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用程序
CMD ["npm", "run", "serve"]
