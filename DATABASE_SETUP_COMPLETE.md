# ✅ 数据库设置完成

## 📋 已完成的工作

### 1. 数据库迁移准备 ✅
- ✅ Prisma Schema 已定义（所有表和关系）
- ✅ 种子数据脚本已更新（包含完整测试数据）
- ✅ 迁移脚本已创建（PowerShell 和 CMD）
- ✅ 详细文档已创建

### 2. 创建的文件

#### 文档
- `DATABASE_MIGRATION_GUIDE.md` - 完整的迁移指南
- `DATABASE_SETUP_COMPLETE.md` - 本文件

#### 脚本
- `scripts/setup-database.ps1` - PowerShell 自动化脚本
- `scripts/setup-database.cmd` - CMD 批处理脚本
- `prisma/seed.ts` - 更新的种子数据脚本

### 3. 种子数据内容

#### 用户 (2个)
- **管理员账户**
  - 邮箱: `admin@mypilot.com`
  - 密码: `admin123`
  - 角色: ADMIN
  
- **测试客户账户**
  - 邮箱: `customer@example.com`
  - 密码: `customer123`
  - 角色: CUSTOMER
  - 包含默认地址

#### 分类 (4个)
- Hardware（父分类）
  - Cameras（子分类）
  - Sensors（子分类）
  - Controllers（子分类）

#### 产品 (8个)
1. **HD Camera Module** - $299.99 ⭐ Featured
2. **Wide Angle Camera** - $399.99 ⭐ Featured
3. **Night Vision Camera** - $499.99
4. **LiDAR Sensor** - $1,299.99 ⭐ Featured
5. **Radar Sensor** - $799.99 ⭐ Featured
6. **Ultrasonic Sensor** - $149.99
7. **AI Computing Unit** - $1,999.99 ⭐ Featured
8. **Control Module** - $899.99

#### 其他数据
- **产品翻译**: 4个产品的中文翻译
- **配送费率**: 6个不同国家/地区的配送选项
- **评价**: 2个示例产品评价
- **地址**: 1个测试客户地址

## 🚀 如何运行

### 方法 1：使用自动化脚本（推荐）

#### Windows PowerShell:
```powershell
.\scripts\setup-database.ps1
```

#### Windows CMD:
```cmd
scripts\setup-database.cmd
```

### 方法 2：手动运行

```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 运行迁移
npx prisma migrate dev --name init

# 3. 运行种子数据
npx prisma db seed
```

## ⚠️ 前提条件

在运行迁移之前，请确保：

1. **PostgreSQL 已安装并运行**
   ```bash
   # 检查 PostgreSQL 状态
   # Windows: 在服务管理器中查看
   # 或使用 Docker:
   docker-compose up -d
   ```

2. **数据库已创建**
   ```bash
   # 如果使用本地 PostgreSQL
   createdb mypilot
   
   # 或使用 SQL
   psql -U postgres -c "CREATE DATABASE mypilot;"
   ```

3. **环境变量已配置**
   - 确保 `.env` 文件存在
   - 检查 `DATABASE_URL` 是否正确

## 🔍 验证安装

### 1. 使用 Prisma Studio（推荐）
```bash
npx prisma studio
```
这会在浏览器中打开可视化界面，你可以查看所有数据。

### 2. 使用 SQL 查询
```bash
# 连接到数据库
psql -U postgres -d mypilot

# 查看所有表
\dt

# 查看用户
SELECT email, name, role FROM "User";

# 查看产品
SELECT name, price, inventory FROM "Product";
```

### 3. 测试 API
启动开发服务器后，访问：
- http://localhost:3000/api/products
- http://localhost:3000/api/categories

## 📊 数据库统计

运行种子脚本后，你的数据库将包含：

| 表名 | 记录数 | 说明 |
|------|--------|------|
| User | 2 | 1个管理员 + 1个客户 |
| Address | 1 | 客户的默认地址 |
| Category | 4 | 1个父分类 + 3个子分类 |
| Product | 8 | 各种自动驾驶硬件产品 |
| ProductTranslation | 4 | 中文产品翻译 |
| ShippingRate | 6 | 不同国家的配送费率 |
| Review | 2 | 示例产品评价 |

## 🎯 下一步

数据库设置完成后：

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问网站**
   - 前端: http://localhost:3000
   - 管理后台: http://localhost:3000/admin

3. **测试功能**
   - 使用测试账户登录
   - 浏览产品
   - 添加到购物车
   - 创建订单（注意：支付功能还未集成）

4. **查看数据**
   ```bash
   npx prisma studio
   ```

## 🔄 重置数据库

如果需要重新开始：

```bash
# 警告：这会删除所有数据！
npx prisma migrate reset

# 这会自动：
# 1. 删除数据库
# 2. 重新创建数据库
# 3. 运行所有迁移
# 4. 运行种子脚本
```

## ❓ 常见问题

### 问题：连接被拒绝
```
Error: P1001: Can't reach database server
```
**解决方案**：
- 确保 PostgreSQL 正在运行
- 检查 `.env` 中的连接字符串
- 如果使用 Docker: `docker-compose ps`

### 问题：数据库不存在
```
Error: P1003: Database mypilot does not exist
```
**解决方案**：
```bash
createdb mypilot
```

### 问题：权限错误
```
Error: P1010: User does not have permission
```
**解决方案**：
- 确保数据库用户有足够的权限
- 或者使用超级用户（如 `postgres`）

### 问题：端口已被占用
```
Error: Port 5432 is already in use
```
**解决方案**：
- 检查是否有其他 PostgreSQL 实例正在运行
- 更改端口或停止其他实例

## 📚 相关文档

- [DATABASE_MIGRATION_GUIDE.md](./DATABASE_MIGRATION_GUIDE.md) - 详细迁移指南
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - 数据库配置说明
- [prisma/README.md](./prisma/README.md) - Prisma 使用说明
- [README.md](./README.md) - 项目主文档

## ✨ 提示

- 使用 `npx prisma studio` 可视化查看和编辑数据
- 使用 `npx prisma migrate reset` 重置数据库
- 种子脚本是幂等的，可以多次运行
- 所有密码都使用 bcrypt 哈希存储

## 🎉 完成！

你的数据库现在已经准备好了！可以开始测试应用程序的所有功能。

如果遇到任何问题，请查看 `DATABASE_MIGRATION_GUIDE.md` 获取更详细的说明。
