# 🐳 Docker Desktop 安装和设置指南

## 📥 步骤 1：下载 Docker Desktop

1. **访问官方网站**
   - 打开浏览器，访问：https://www.docker.com/products/docker-desktop/
   
2. **下载 Windows 版本**
   - 点击 "Download for Windows"
   - 文件大小约 500MB，下载可能需要几分钟

3. **系统要求**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 或更高)
   - 或 Windows 11
   - 启用 WSL 2（Windows Subsystem for Linux）

## 🔧 步骤 2：安装 Docker Desktop

1. **运行安装程序**
   - 双击下载的 `Docker Desktop Installer.exe`
   - 如果出现 UAC 提示，点击"是"

2. **配置选项**
   - ✅ 勾选 "Use WSL 2 instead of Hyper-V"（推荐）
   - ✅ 勾选 "Add shortcut to desktop"
   - 点击 "Ok"

3. **等待安装**
   - 安装过程需要 5-10 分钟
   - 完成后会提示重启电脑

4. **重启电脑**
   - 点击 "Close and restart"
   - 电脑会重启

## 🚀 步骤 3：首次启动 Docker Desktop

1. **启动 Docker Desktop**
   - 重启后，Docker Desktop 会自动启动
   - 或者从桌面/开始菜单打开 Docker Desktop

2. **接受服务条款**
   - 阅读并接受 Docker 服务条款

3. **等待 Docker 启动**
   - 看到 "Docker Desktop is running" 表示启动成功
   - 系统托盘会显示 Docker 图标（鲸鱼）

4. **验证安装**
   - 打开 PowerShell 或 CMD
   - 运行以下命令：
   ```bash
   docker --version
   docker-compose --version
   ```
   - 应该看到版本信息

## ✅ 步骤 4：配置 Docker（可选但推荐）

1. **打开 Docker Desktop 设置**
   - 点击系统托盘的 Docker 图标
   - 选择 "Settings"

2. **资源配置**
   - 进入 "Resources" → "Advanced"
   - 建议设置：
     - CPUs: 2-4 核
     - Memory: 4-8 GB
     - Swap: 1-2 GB
     - Disk image size: 60 GB

3. **应用更改**
   - 点击 "Apply & Restart"

## 🎯 步骤 5：启动 MyPilot 数据库

现在你可以启动项目的数据库了！

### 5.1 检查 docker-compose.yml

确保项目根目录有 `docker-compose.yml` 文件。

### 5.2 启动数据库

打开 PowerShell 或 CMD，在项目目录运行：

```bash
# 启动数据库（后台运行）
docker-compose up -d
```

**预期输出：**
```
Creating network "mypilot_default" with the default driver
Creating mypilot_postgres_1 ... done
Creating mypilot_redis_1    ... done
```

### 5.3 验证数据库运行

```bash
# 查看运行中的容器
docker-compose ps
```

**预期输出：**
```
Name                    Command              State           Ports
-------------------------------------------------------------------------
mypilot_postgres_1   docker-entrypoint.sh postgres   Up      0.0.0.0:5432->5432/tcp
mypilot_redis_1      docker-entrypoint.sh redis ...  Up      0.0.0.0:6379->6379/tcp
```

## 🌱 步骤 6：运行数据库设置

数据库启动后，运行设置脚本：

```powershell
# PowerShell
.\scripts\setup-database.ps1

# 或 CMD
scripts\setup-database.cmd
```

这会：
1. ✅ 生成 Prisma Client
2. ✅ 创建数据库表
3. ✅ 填充测试数据

## 🎉 步骤 7：启动应用

```bash
npm run dev
```

访问：http://localhost:3000

## 📊 常用 Docker 命令

### 查看状态
```bash
# 查看运行中的容器
docker-compose ps

# 查看容器日志
docker-compose logs

# 查看 PostgreSQL 日志
docker-compose logs postgres
```

### 启动/停止
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart
```

### 数据管理
```bash
# 停止并删除所有数据（谨慎使用！）
docker-compose down -v

# 重新构建并启动
docker-compose up -d --build
```

### 进入容器
```bash
# 进入 PostgreSQL 容器
docker-compose exec postgres psql -U postgres -d mypilot

# 进入 Redis 容器
docker-compose exec redis redis-cli
```

## ❓ 常见问题

### 问题 1：Docker Desktop 无法启动

**错误信息：** "Docker Desktop failed to start"

**解决方案：**
1. 确保 WSL 2 已安装和启用
2. 以管理员身份运行 PowerShell：
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```
3. 重启电脑

### 问题 2：端口已被占用

**错误信息：** "Port 5432 is already allocated"

**解决方案：**
1. 检查是否有其他 PostgreSQL 实例在运行
2. 修改 `docker-compose.yml` 中的端口映射：
   ```yaml
   ports:
     - "5433:5432"  # 改为 5433
   ```
3. 同时更新 `.env` 中的端口

### 问题 3：WSL 2 未安装

**错误信息：** "WSL 2 installation is incomplete"

**解决方案：**
1. 以管理员身份运行 PowerShell
2. 执行：
   ```powershell
   wsl --install
   ```
3. 重启电脑
4. 重新启动 Docker Desktop

### 问题 4：虚拟化未启用

**错误信息：** "Hardware assisted virtualization and data execution protection must be enabled in the BIOS"

**解决方案：**
1. 重启电脑
2. 进入 BIOS 设置（通常按 F2, F10, 或 Del）
3. 启用 "Intel VT-x" 或 "AMD-V"
4. 启用 "Hyper-V"
5. 保存并退出

### 问题 5：Docker 命令找不到

**错误信息：** "docker: command not found"

**解决方案：**
1. 确保 Docker Desktop 正在运行
2. 重启 PowerShell/CMD
3. 检查环境变量是否包含 Docker 路径

## 💡 提示和最佳实践

### 1. 自动启动
- Docker Desktop 可以设置为开机自动启动
- Settings → General → "Start Docker Desktop when you log in"

### 2. 资源监控
- 在 Docker Desktop 中可以查看资源使用情况
- Dashboard → Containers → 查看 CPU/内存使用

### 3. 数据持久化
- Docker 容器的数据存储在 volumes 中
- 即使容器删除，数据也会保留
- 除非使用 `docker-compose down -v`

### 4. 清理空间
```bash
# 清理未使用的镜像和容器
docker system prune -a

# 查看磁盘使用
docker system df
```

## 🔗 有用的链接

- Docker Desktop 文档：https://docs.docker.com/desktop/
- Docker Compose 文档：https://docs.docker.com/compose/
- WSL 2 安装：https://docs.microsoft.com/en-us/windows/wsl/install
- Docker Hub：https://hub.docker.com/

## ✨ 下一步

安装完成后：

1. ✅ 启动 Docker Desktop
2. ✅ 运行 `docker-compose up -d`
3. ✅ 运行 `.\scripts\setup-database.ps1`
4. ✅ 运行 `npm run dev`
5. ✅ 访问 http://localhost:3000

## 🎊 完成！

Docker Desktop 安装完成后，你就可以轻松管理开发环境了！

如果遇到任何问题，请查看上面的常见问题部分，或者告诉我具体的错误信息。
