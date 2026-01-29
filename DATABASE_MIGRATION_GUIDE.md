# 数据库迁移和种子数据指南

## 📋 前提条件

在运行数据库迁移之前，请确保：

1. ✅ PostgreSQL 已安装并运行
2. ✅ 数据库连接信息已配置在 `.env` 文件中
3. ✅ Node.js 和 npm 已安装

## 🚀 快速开始

### 方法 1：使用 Docker（推荐）

如果你已经有 `docker-compose.yml` 文件，可以直接运行：

```bash
# 启动 PostgreSQL 和 Redis
docker-compose up -d

# 等待几秒让数据库启动完成
```

### 方法 2：本地 PostgreSQL

如果你使用本地安装的 PostgreSQL：

1. 确保 PostgreSQL 服务正在运行
2. 创建数据库：
   ```bash
   createdb mypilot
   ```
3. 更新 `.env` 文件中的 `DATABASE_URL`

## 📝 步骤 1：配置环境变量

检查 `.env` 文件，确保数据库连接字符串正确：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mypilot"
```

**Docker 用户**：如果使用 docker-compose，URL 应该是：
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mypilot"
```

## 🔧 步骤 2：生成并运行迁移

运行以下命令来创建数据库表：

```bash
# 生成 Prisma Client
npx prisma generate

# 创建迁移文件并应用到数据库
npx prisma migrate dev --name init

# 或者使用 PowerShell 脚本（Windows）
.\scripts\migrate.ps1
```

**预期输出：**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied migration 20240101000000_init
```

## 🌱 步骤 3：运行种子数据

创建测试数据：

```bash
npx prisma db seed
```

**预期输出：**
```
🌱 Starting database seed...
✅ Created admin user: admin@mypilot.com
✅ Created test customer: customer@example.com
✅ Created categories
✅ Created product: HD Camera Module
✅ Created product: Wide Angle Camera
✅ Created product: LiDAR Sensor
✅ Created product: Radar Sensor
✅ Created shipping rates
🎉 Database seed completed successfully!
```

## 👤 测试账户

种子数据会创建以下测试账户：

### 管理员账户
- **邮箱**: `admin@mypilot.com`
- **密码**: `admin123`
- **权限**: 完整的管理员权限

### 普通用户账户
- **邮箱**: `customer@example.com`
- **密码**: `customer123`
- **权限**: 普通用户权限

## 📦 种子数据内容

种子脚本会创建：

1. **用户** (2个)
   - 1个管理员
   - 1个测试客户

2. **分类** (3个)
   - Hardware（父分类）
     - Cameras（子分类）
     - Sensors（子分类）

3. **产品** (4个)
   - HD Camera Module - $299.99
   - Wide Angle Camera - $399.99
   - LiDAR Sensor - $1,299.99
   - Radar Sensor - $799.99

4. **配送费率** (4个)
   - 美国标准配送 - $9.99
   - 美国快递配送 - $24.99
   - 中国标准配送 - $19.99
   - 欧盟标准配送 - $14.99

## 🔍 验证数据库

### 使用 Prisma Studio（推荐）

```bash
npx prisma studio
```

这会在浏览器中打开一个可视化界面，你可以查看和编辑数据库中的所有数据。

### 使用 SQL 查询

```bash
# 连接到数据库
psql -U postgres -d mypilot

# 查看所有表
\dt

# 查看用户
SELECT id, email, name, role FROM "User";

# 查看产品
SELECT id, name, price, inventory FROM "Product";

# 退出
\q
```

## 🔄 重置数据库

如果需要重新开始：

```bash
# 删除所有数据并重新运行迁移
npx prisma migrate reset

# 这会自动运行种子脚本
```

**警告**：这会删除所有数据！

## ❌ 常见问题

### 问题 1：连接被拒绝

```
Error: P1001: Can't reach database server
```

**解决方案**：
- 检查 PostgreSQL 是否正在运行
- 验证 `.env` 中的连接字符串
- 如果使用 Docker，确保容器正在运行：`docker-compose ps`

### 问题 2：数据库不存在

```
Error: P1003: Database mypilot does not exist
```

**解决方案**：
```bash
# 创建数据库
createdb mypilot

# 或者使用 SQL
psql -U postgres -c "CREATE DATABASE mypilot;"
```

### 问题 3：权限错误

```
Error: P1010: User does not have permission
```

**解决方案**：
- 确保数据库用户有足够的权限
- 或者使用超级用户（如 `postgres`）

### 问题 4：端口已被占用

```
Error: Port 5432 is already in use
```

**解决方案**：
- 检查是否有其他 PostgreSQL 实例正在运行
- 更改 docker-compose.yml 中的端口映射
- 或者停止其他 PostgreSQL 实例

## 📊 数据库架构

查看完整的数据库架构：

```bash
npx prisma studio
```

或者生成 ERD 图：

```bash
npx prisma generate
```

## 🧪 测试数据库连接

创建一个简单的测试脚本：

```typescript
// test-db.ts
import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    const userCount = await prisma.user.count();
    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${userCount} users in database`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

运行测试：
```bash
npx ts-node test-db.ts
```

## 🎯 下一步

数据库设置完成后，你可以：

1. ✅ 启动开发服务器：`npm run dev`
2. ✅ 访问 http://localhost:3000
3. ✅ 使用测试账户登录
4. ✅ 测试所有功能

## 📚 相关文档

- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [项目 README](./README.md)
- [数据库设置文档](./DATABASE_SETUP.md)
