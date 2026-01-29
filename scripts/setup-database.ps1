# MyPilot 数据库设置脚本
# 用法: .\scripts\setup-database.ps1

Write-Host "🚀 MyPilot 数据库设置" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# 检查 .env 文件
if (-not (Test-Path ".env")) {
    Write-Host "❌ 错误: .env 文件不存在" -ForegroundColor Red
    Write-Host "请先复制 .env.example 到 .env 并配置数据库连接" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 找到 .env 文件" -ForegroundColor Green
Write-Host ""

# 步骤 1: 生成 Prisma Client
Write-Host "📦 步骤 1/3: 生成 Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Client 生成失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client 生成成功" -ForegroundColor Green
Write-Host ""

# 步骤 2: 运行数据库迁移
Write-Host "🔧 步骤 2/3: 运行数据库迁移..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 数据库迁移失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "常见问题:" -ForegroundColor Yellow
    Write-Host "  1. 确保 PostgreSQL 正在运行" -ForegroundColor White
    Write-Host "  2. 检查 .env 中的 DATABASE_URL 是否正确" -ForegroundColor White
    Write-Host "  3. 确保数据库已创建: createdb mypilot" -ForegroundColor White
    exit 1
}
Write-Host "✅ 数据库迁移成功" -ForegroundColor Green
Write-Host ""

# 步骤 3: 运行种子数据
Write-Host "🌱 步骤 3/3: 创建种子数据..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 种子数据创建失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 完成
Write-Host "=" * 50 -ForegroundColor Green
Write-Host "🎉 数据库设置完成!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""
Write-Host "📊 下一步:" -ForegroundColor Cyan
Write-Host "  1. 启动开发服务器: npm run dev" -ForegroundColor White
Write-Host "  2. 访问: http://localhost:3000" -ForegroundColor White
Write-Host "  3. 使用测试账户登录:" -ForegroundColor White
Write-Host "     • 管理员: admin@mypilot.com / admin123" -ForegroundColor White
Write-Host "     • 用户: customer@example.com / customer123" -ForegroundColor White
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Cyan
Write-Host "  • 查看数据库: npx prisma studio" -ForegroundColor White
Write-Host "  • 重置数据库: npx prisma migrate reset" -ForegroundColor White
Write-Host ""
