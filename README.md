# MyPilot 自动驾驶硬件销售网站

MyPilot 是一个面向全球市场的自动驾驶硬件销售平台，提供比 comma.ai 和 koumma.ai 更优秀的用户体验。

## 技术栈

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Stripe, PayPal, Alipay
- **Deployment**: Vercel
- **Internationalization**: next-intl (支持 en, zh-CN, zh-TW, ja, ko)

## 开发环境设置

1. 安装依赖:
```bash
npm install
```

2. 配置环境变量:
```bash
cp .env.example .env
# 编辑 .env 文件，填入实际的配置值
```

3. 启动开发服务器:
```bash
npm run dev
```

4. 访问应用:
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run format` - 使用 Prettier 格式化代码

## 项目结构

```
mypilot-website/
├── app/                    # Next.js App Router 目录
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
├── lib/                   # 工具函数和配置
├── public/                # 静态资源
├── .kiro/                 # Kiro 规范文档
│   └── specs/
│       └── mypilot-website/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── .env.example           # 环境变量示例
├── .eslintrc.json         # ESLint 配置
├── .prettierrc            # Prettier 配置
├── next.config.js         # Next.js 配置
├── tailwind.config.ts     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖

```

## 功能特性

- ✅ 多语言支持 (en, zh-CN, zh-TW, ja, ko)
- ✅ 多货币支持 (USD, EUR, CNY, JPY, KRW)
- ✅ 产品展示与浏览
- ✅ 购物车管理
- ✅ 用户认证与账户管理
- ✅ 订单处理与支付
- ✅ 国际物流追踪
- ✅ 产品评价系统
- ✅ 管理后台
- ✅ SEO 优化
- ✅ 响应式设计

## 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 使用 Tailwind CSS 进行样式开发
- 遵循 Next.js App Router 最佳实践
- 编写单元测试和属性测试

## License

Private - All rights reserved
