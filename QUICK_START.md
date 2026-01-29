# 🚀 MyPilot 快速启动指南

## 📦 步骤 1：设置数据库

### 选项 A：云数据库（推荐，无需 Docker）⭐

**最简单的方式！5 分钟完成！**

1. **注册 Neon 账号**：https://neon.tech
2. **创建项目**，复制连接字符串
3. **更新 .env 文件**：
   ```env
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
4. **运行设置脚本**：
   ```powershell
   .\scripts\setup-database.ps1
   ```

📖 详细指南：查看 `CLOUD_DATABASE_SETUP.md`

### 选项 B：Docker（需要安装 Docker Desktop）

```powershell
# 启动数据库
docker-compose up -d

# 运行设置脚本
.\scripts\setup-database.ps1
```

### 选项 C：手动运行（如果脚本失败）

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 🎯 启动应用

```bash
npm run dev
```

访问: http://localhost:3000

## 👤 测试账户

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@mypilot.com | admin123 |
| 用户 | customer@example.com | customer123 |

## 🛠️ 常用命令

```bash
# 查看数据库
npx prisma studio

# 重置数据库
npx prisma migrate reset

# 运行测试
npm test

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 📊 已有数据

- ✅ 2个用户（1管理员 + 1客户）
- ✅ 4个分类
- ✅ 8个产品（含中文翻译）
- ✅ 6个配送费率
- ✅ 2个产品评价
- ✅ 1个测试地址

## 🔗 重要链接

- 前端: http://localhost:3000
- 管理后台: http://localhost:3000/admin
- Prisma Studio: `npx prisma studio`
- API 文档: [BACKEND_API_IMPLEMENTATION.md](./BACKEND_API_IMPLEMENTATION.md)

## ⚠️ 注意事项

1. **数据库设置**
   - 推荐使用云数据库（Neon）- 无需安装
   - 或使用 Docker: `docker-compose up -d`
   - 或本地 PostgreSQL

2. **环境变量**
   - 确保 `.env` 文件存在
   - 检查 `DATABASE_URL` 配置
   - 云数据库需要包含 `?sslmode=require`

3. **未完成功能**
   - ❌ 支付集成（Stripe/PayPal）
   - ❌ 邮件服务
   - ⚠️ 使用模拟数据测试

## 📖 详细文档

- [DATABASE_SETUP_COMPLETE.md](./DATABASE_SETUP_COMPLETE.md) - 数据库设置详情
- [DATABASE_MIGRATION_GUIDE.md](./DATABASE_MIGRATION_GUIDE.md) - 迁移指南
- [BACKEND_API_IMPLEMENTATION.md](./BACKEND_API_IMPLEMENTATION.md) - API 文档
- [FRONTEND_COMPLETE_SUMMARY.md](./FRONTEND_COMPLETE_SUMMARY.md) - 前端文档
