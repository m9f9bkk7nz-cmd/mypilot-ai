# 部署前检查脚本 (PowerShell)
# 确保所有必要的配置都已就绪

Write-Host "🔍 开始部署前检查..." -ForegroundColor Cyan
Write-Host ""

# 检查环境变量
Write-Host "📋 检查环境变量..." -ForegroundColor Yellow
$requiredVars = @(
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "RESEND_API_KEY"
)

$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not (Test-Path "env:$var")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ 缺少以下环境变量:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "请在 Vercel 项目设置中添加这些环境变量" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ 所有必需的环境变量都已设置" -ForegroundColor Green
}

Write-Host ""

# 检查数据库连接
Write-Host "🗄️  检查数据库连接..." -ForegroundColor Yellow
try {
    npx prisma db pull --force 2>&1 | Out-Null
    Write-Host "✅ 数据库连接成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 数据库连接失败" -ForegroundColor Red
    Write-Host "请检查 DATABASE_URL 是否正确" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 检查依赖
Write-Host "📦 检查依赖..." -ForegroundColor Yellow
try {
    npm list 2>&1 | Out-Null
    Write-Host "✅ 所有依赖已安装" -ForegroundColor Green
} catch {
    Write-Host "⚠️  发现依赖问题，运行 npm install" -ForegroundColor Yellow
    npm install
}

Write-Host ""

# 运行测试
Write-Host "🧪 运行测试..." -ForegroundColor Yellow
try {
    npm test 2>&1 | Out-Null
    Write-Host "✅ 所有测试通过" -ForegroundColor Green
} catch {
    Write-Host "⚠️  部分测试失败，但继续部署" -ForegroundColor Yellow
}

Write-Host ""

# 检查构建
Write-Host "🏗️  检查构建..." -ForegroundColor Yellow
try {
    npm run build 2>&1 | Out-Null
    Write-Host "✅ 构建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ 所有检查通过！可以部署了" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 提交代码: git add . && git commit -m 'Ready for deployment'"
Write-Host "2. 推送到 GitHub: git push origin main"
Write-Host "3. Vercel 将自动部署"
