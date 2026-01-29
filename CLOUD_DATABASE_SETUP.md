# 🌐 云数据库设置指南（无需 Docker）

## 为什么选择云数据库？

- ✅ 无需安装任何软件
- ✅ 完全免费（有免费额度）
- ✅ 自动备份
- ✅ 随时随地访问
- ✅ 5 分钟内完成设置

---

## 选项 1：Neon（推荐）⭐

### 特点
- 完全免费（3GB 存储）
- 无需信用卡
- 自动休眠（节省资源）
- 超快速度

### 设置步骤

#### 1. 注册账号
访问：https://neon.tech

点击 "Sign Up" 或 "Get Started"

可以使用：
- GitHub 账号（推荐）
- Google 账号
- 邮箱注册

#### 2. 创建项目
登录后会自动提示创建项目：

- **Project name**: `mypilot`
- **Region**: 选择离你最近的（如 Asia Pacific - Singapore）
- **PostgreSQL version**: 15（默认）

点击 "Create Project"

#### 3. 获取连接字符串
创建完成后，会显示连接信息：

```
Connection string:
postgresql://username:password@ep-xxx-xxx.neon.tech/neondb?sslmode=require
```

**复制这个连接字符串！**

#### 4. 更新 .env 文件
打开项目的 `.env` 文件，更新 `DATABASE_URL`：

```env
# Database - Neon
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Environment
NODE_ENV="development"
```

#### 5. 运行数据库设置
```powershell
# PowerShell
.\scripts\setup-database.ps1

# 或 CMD
scripts\setup-database.cmd
```

#### 6. 启动应用
```bash
npm run dev
```

访问：http://localhost:3000

---

## 选项 2：Supabase

### 特点
- 免费 500MB 数据库
- 包含认证和存储
- 自动 API 生成

### 设置步骤

#### 1. 注册账号
访问：https://supabase.com

点击 "Start your project"

使用 GitHub 账号登录

#### 2. 创建项目
- **Name**: `mypilot`
- **Database Password**: 设置一个强密码（记住它！）
- **Region**: 选择离你最近的

点击 "Create new project"（需要等待 1-2 分钟）

#### 3. 获取连接字符串
项目创建完成后：

1. 点击左侧 "Settings" → "Database"
2. 找到 "Connection string" 部分
3. 选择 "URI" 标签
4. 复制连接字符串
5. 将 `[YOUR-PASSWORD]` 替换为你设置的密码

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

#### 4. 更新 .env 文件
```env
DATABASE_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"
```

#### 5. 运行设置脚本
```powershell
.\scripts\setup-database.ps1
```

---

## 选项 3：Railway

### 特点
- 免费 $5 额度/月
- 简单易用
- 自动部署

### 设置步骤

#### 1. 注册账号
访问：https://railway.app

使用 GitHub 账号登录

#### 2. 创建项目
1. 点击 "New Project"
2. 选择 "Provision PostgreSQL"
3. 等待数据库创建完成

#### 3. 获取连接字符串
1. 点击 PostgreSQL 服务
2. 切换到 "Connect" 标签
3. 复制 "Postgres Connection URL"

```
postgresql://postgres:xxx@containers-us-west-xxx.railway.app:7432/railway
```

#### 4. 更新 .env 文件
```env
DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:7432/railway"
```

#### 5. 运行设置脚本
```powershell
.\scripts\setup-database.ps1
```

---

## 选项 4：ElephantSQL

### 特点
- 免费 20MB 数据库
- 专注于 PostgreSQL
- 简单直接

### 设置步骤

#### 1. 注册账号
访问：https://www.elephantsql.com

点击 "Get a managed database today"

#### 2. 创建实例
1. 点击 "Create New Instance"
2. **Name**: `mypilot`
3. **Plan**: 选择 "Tiny Turtle (Free)"
4. **Region**: 选择离你最近的
5. 点击 "Create instance"

#### 3. 获取连接字符串
1. 点击刚创建的实例
2. 复制 "URL" 字段的值

```
postgres://xxx:xxx@lucky.db.elephantsql.com/xxx
```

#### 4. 更新 .env 文件
```env
DATABASE_URL="postgres://xxx:xxx@lucky.db.elephantsql.com/xxx"
```

#### 5. 运行设置脚本
```powershell
.\scripts\setup-database.ps1
```

---

## 🎯 推荐选择

### 开发阶段（现在）
**推荐：Neon** ⭐
- 最快设置
- 完全免费
- 无需信用卡
- 3GB 存储足够开发使用

### 生产部署
**推荐：Supabase 或 Railway**
- 更稳定
- 更多功能
- 更好的监控

---

## ⚠️ 注意事项

### 1. 连接字符串格式
确保连接字符串包含：
- 用户名
- 密码
- 主机地址
- 端口
- 数据库名

### 2. SSL 模式
某些云数据库需要 SSL：
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### 3. 连接限制
免费计划通常有连接数限制：
- Neon: 100 连接
- Supabase: 60 连接
- ElephantSQL: 5 连接

开发阶段完全够用。

---

## 🧪 测试连接

设置完成后，测试数据库连接：

```bash
# 生成 Prisma Client
npx prisma generate

# 测试连接
npx prisma db push
```

如果成功，会看到：
```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

---

## 🚀 完整设置流程

1. **选择云数据库服务**（推荐 Neon）
2. **注册并创建数据库**
3. **复制连接字符串**
4. **更新 .env 文件**
5. **运行设置脚本**：
   ```powershell
   .\scripts\setup-database.ps1
   ```
6. **启动应用**：
   ```bash
   npm run dev
   ```
7. **访问**：http://localhost:3000

---

## 💡 常见问题

### Q: 连接失败怎么办？
A: 检查：
1. 连接字符串是否正确复制
2. 密码中是否有特殊字符需要编码
3. 是否包含 `?sslmode=require`

### Q: 免费额度够用吗？
A: 开发阶段完全够用：
- Neon: 3GB 存储
- Supabase: 500MB 存储
- 都足够存储数千个产品和订单

### Q: 数据会丢失吗？
A: 不会，云数据库有自动备份。但建议：
- 定期导出数据
- 生产环境使用付费计划

### Q: 速度会慢吗？
A: 取决于服务器位置：
- 选择离你最近的区域
- Neon 和 Supabase 速度都很快
- 开发阶段完全够用

---

## 🎊 完成！

设置完成后，你的系统就完全可用了！

测试账户：
- 管理员: admin@mypilot.com / admin123
- 用户: customer@example.com / customer123

享受开发吧！ 🚀
