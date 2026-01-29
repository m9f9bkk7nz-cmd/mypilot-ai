@echo off
REM MyPilot 数据库设置脚本
REM 用法: scripts\setup-database.cmd

echo.
echo ========================================
echo   MyPilot 数据库设置
echo ========================================
echo.

REM 检查 .env 文件
if not exist ".env" (
    echo [错误] .env 文件不存在
    echo 请先复制 .env.example 到 .env 并配置数据库连接
    exit /b 1
)

echo [OK] 找到 .env 文件
echo.

REM 步骤 1: 生成 Prisma Client
echo 步骤 1/3: 生成 Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo [错误] Prisma Client 生成失败
    exit /b 1
)
echo [OK] Prisma Client 生成成功
echo.

REM 步骤 2: 运行数据库迁移
echo 步骤 2/3: 运行数据库迁移...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo [错误] 数据库迁移失败
    echo.
    echo 常见问题:
    echo   1. 确保 PostgreSQL 正在运行
    echo   2. 检查 .env 中的 DATABASE_URL 是否正确
    echo   3. 确保数据库已创建: createdb mypilot
    exit /b 1
)
echo [OK] 数据库迁移成功
echo.

REM 步骤 3: 运行种子数据
echo 步骤 3/3: 创建种子数据...
call npx prisma db seed
if errorlevel 1 (
    echo [错误] 种子数据创建失败
    exit /b 1
)
echo.

REM 完成
echo ========================================
echo   数据库设置完成!
echo ========================================
echo.
echo 下一步:
echo   1. 启动开发服务器: npm run dev
echo   2. 访问: http://localhost:3000
echo   3. 使用测试账户登录:
echo      - 管理员: admin@mypilot.com / admin123
echo      - 用户: customer@example.com / customer123
echo.
echo 提示:
echo   - 查看数据库: npx prisma studio
echo   - 重置数据库: npx prisma migrate reset
echo.
