# 功能测试脚本
# 测试所有核心功能是否正常工作

Write-Host "🧪 MyPilot 功能测试" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"
$testsPassed = 0
$testsFailed = 0

# 测试函数
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    Write-Host "测试: $Name" -NoNewline
    
    try {
        $params = @{
            Uri = "$baseUrl$Url"
            Method = $Method
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host " ✅ 通过" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host " ❌ 失败 (状态码: $($response.StatusCode))" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    } catch {
        Write-Host " ❌ 失败 ($($_.Exception.Message))" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

Write-Host "📋 开始测试...`n" -ForegroundColor Yellow

# 1. 健康检查
Write-Host "`n1️⃣  系统健康检查" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "健康检查端点" -Url "/api/health"

# 2. 页面测试
Write-Host "`n2️⃣  页面访问测试" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "首页" -Url "/en"
Test-Endpoint -Name "产品列表页" -Url "/en/products"
Test-Endpoint -Name "购物车页" -Url "/en/cart"
Test-Endpoint -Name "登录页" -Url "/en/auth/login"
Test-Endpoint -Name "注册页" -Url "/en/auth/register"
Test-Endpoint -Name "关于页" -Url "/en/about"
Test-Endpoint -Name "联系页" -Url "/en/contact"

# 3. API 测试
Write-Host "`n3️⃣  API 端点测试" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "产品 API" -Url "/api/products"
Test-Endpoint -Name "分类 API" -Url "/api/categories"
Test-Endpoint -Name "购物车 API" -Url "/api/cart"

# 4. 货币系统测试
Write-Host "`n4️⃣  货币系统测试" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "汇率 API" -Url "/api/currency/rates?base=USD"
Test-Endpoint -Name "货币转换 API" -Url "/api/currency/convert?amount=100&from=USD&to=CNY"

# 5. 多语言测试
Write-Host "`n5️⃣  多语言支持测试" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "英文页面" -Url "/en"
Test-Endpoint -Name "简体中文页面" -Url "/zh-CN"
Test-Endpoint -Name "繁体中文页面" -Url "/zh-TW"
Test-Endpoint -Name "日文页面" -Url "/ja"
Test-Endpoint -Name "韩文页面" -Url "/ko"

# 6. SEO 测试
Write-Host "`n6️⃣  SEO 功能测试" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "Sitemap" -Url "/sitemap.xml"
Test-Endpoint -Name "Robots.txt" -Url "/robots.txt"

# 总结
Write-Host "`n=========================================="
Write-Host "📊 测试结果总结" -ForegroundColor Cyan
Write-Host "==========================================" 
Write-Host "✅ 通过: $testsPassed" -ForegroundColor Green
Write-Host "❌ 失败: $testsFailed" -ForegroundColor Red
Write-Host "📈 成功率: $([math]::Round(($testsPassed / ($testsPassed + $testsFailed)) * 100, 2))%"

if ($testsFailed -eq 0) {
    Write-Host "`n🎉 所有测试通过！系统运行正常！" -ForegroundColor Green
    Write-Host "✨ 你可以开始添加产品并开始销售了！" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  有 $testsFailed 个测试失败" -ForegroundColor Yellow
    Write-Host "请检查失败的端点并修复问题" -ForegroundColor Yellow
}

Write-Host "`n📝 提示:" -ForegroundColor Cyan
Write-Host "- 确保开发服务器正在运行 (npm run dev)"
Write-Host "- 确保数据库连接正常"
Write-Host "- 查看终端输出以获取详细错误信息"
Write-Host ""
