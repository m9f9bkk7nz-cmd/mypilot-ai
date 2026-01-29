# 项目设置指南 / Project Setup Guide

## 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies

由于 PowerShell 执行策略限制，请在命令提示符 (CMD) 中运行：

```cmd
npm install
```

或者，如果您使用 PowerShell，请先设置执行策略：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install
```

### 2. 配置环境变量 / Configure Environment Variables

```cmd
copy .env.example .env
```

然后编辑 `.env` 文件，填入实际的配置值。

### 3. 初始化 Git 仓库 / Initialize Git Repository

```cmd
git init
git add .
git commit -m "Initial commit: Project setup"
```

### 4. 启动开发服务器 / Start Development Server

```cmd
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 已完成的配置 / Completed Configuration

✅ Next.js 14 项目结构（使用 App Router）
✅ TypeScript 配置
✅ ESLint 配置
✅ Prettier 配置
✅ Tailwind CSS 配置
✅ 环境变量管理（.env.example）
✅ Git 忽略文件（.gitignore）
✅ 基础项目结构（app/, components/, lib/, public/）
✅ 项目文档（README.md）
✅ Prisma ORM 配置
✅ 数据库模型定义（User, Product, Order, Cart, Review 等）

## 数据库设置 / Database Setup

### 前置要求 / Prerequisites

1. 安装 PostgreSQL 15+ 并确保服务运行
2. 创建数据库：
   ```sql
   CREATE DATABASE mypilot;
   ```

### 配置数据库连接 / Configure Database Connection

在 `.env` 文件中更新数据库连接字符串：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mypilot"
```

### 运行数据库迁移 / Run Database Migrations

```cmd
npm run prisma:migrate
```

输入迁移名称（例如："init"）后，Prisma 将：
- 创建迁移文件
- 在数据库中创建所有表
- 生成 Prisma Client

### 查看数据库 / View Database

使用 Prisma Studio 可视化查看数据库：

```cmd
npm run prisma:studio
```

访问 http://localhost:5555 查看数据库内容。

详细的数据库设置说明请参考 `prisma/README.md`。

## 下一步 / Next Steps

1. 运行 `npm install` 安装所有依赖
2. 配置 `.env` 文件
3. 设置 PostgreSQL 数据库
4. 运行数据库迁移：`npm run prisma:migrate`
5. 初始化 Git 仓库
6. 开始实现下一个任务：认证系统实现

## 故障排除 / Troubleshooting

### PowerShell 执行策略错误

如果遇到 "无法加载文件...因为在此系统上禁止运行脚本" 错误：

**方法 1**: 使用 CMD 而不是 PowerShell
```cmd
cmd
npm install
```

**方法 2**: 临时更改 PowerShell 执行策略
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**方法 3**: 使用 npx 的完整路径
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

### npm 安装超时

如果 npm install 超时，可以尝试：

```cmd
npm install --verbose
```

或使用国内镜像：

```cmd
npm config set registry https://registry.npmmirror.com
npm install
```
