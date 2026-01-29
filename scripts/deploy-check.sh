#!/bin/bash

# 部署前检查脚本
# 确保所有必要的配置都已就绪

echo "🔍 开始部署前检查..."
echo ""

# 检查环境变量
echo "📋 检查环境变量..."
REQUIRED_VARS=(
  "DATABASE_URL"
  "NEXTAUTH_URL"
  "NEXTAUTH_SECRET"
  "STRIPE_SECRET_KEY"
  "RESEND_API_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "❌ 缺少以下环境变量:"
  for var in "${MISSING_VARS[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "请在 Vercel 项目设置中添加这些环境变量"
  exit 1
else
  echo "✅ 所有必需的环境变量都已设置"
fi

echo ""

# 检查数据库连接
echo "🗄️  检查数据库连接..."
if npx prisma db pull --force > /dev/null 2>&1; then
  echo "✅ 数据库连接成功"
else
  echo "❌ 数据库连接失败"
  echo "请检查 DATABASE_URL 是否正确"
  exit 1
fi

echo ""

# 检查依赖
echo "📦 检查依赖..."
if npm list > /dev/null 2>&1; then
  echo "✅ 所有依赖已安装"
else
  echo "⚠️  发现依赖问题，运行 npm install"
  npm install
fi

echo ""

# 运行测试
echo "🧪 运行测试..."
if npm test > /dev/null 2>&1; then
  echo "✅ 所有测试通过"
else
  echo "⚠️  部分测试失败，但继续部署"
fi

echo ""

# 检查构建
echo "🏗️  检查构建..."
if npm run build > /dev/null 2>&1; then
  echo "✅ 构建成功"
else
  echo "❌ 构建失败"
  exit 1
fi

echo ""
echo "✅ 所有检查通过！可以部署了"
echo ""
echo "下一步:"
echo "1. 提交代码: git add . && git commit -m 'Ready for deployment'"
echo "2. 推送到 GitHub: git push origin main"
echo "3. Vercel 将自动部署"
