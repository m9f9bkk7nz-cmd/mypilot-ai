# Implementation Plan: MyPilot 自动驾驶硬件销售网站

## Overview

本实现计划将 MyPilot 网站分解为可执行的开发任务。采用增量开发方式，每个任务都建立在前面任务的基础上，确保系统逐步完善并可随时验证。实现将使用 TypeScript 和 Next.js 14+ 框架。

## Tasks

- [x] 1. 项目初始化和基础设施搭建
  - 创建 Next.js 14 项目（使用 App Router）
  - 配置 TypeScript、ESLint、Prettier
  - 设置 Tailwind CSS
  - 配置环境变量管理
  - 设置 Git 仓库和 .gitignore
  - _Requirements: 所有需求的基础_

- [-] 2. 数据库设置和 ORM 配置
  - [x] 2.1 安装和配置 Prisma
    - 安装 Prisma CLI 和客户端
    - 创建 Prisma schema 文件
    - 配置 PostgreSQL 连接
    - _Requirements: 所有需求的数据层基础_
  
  - [x] 2.2 定义核心数据模型
    - 实现 User, Address, Product, Category 模型
    - 实现 Cart, CartItem 模型
    - 实现 Order, OrderItem 模型
    - 实现 Review, ShippingRate 模型
    - 添加所有必要的索引和关系
    - _Requirements: 1.1-1.6, 3.1-3.6, 4.1-4.7, 5.1-5.8, 6.1-6.6, 7.1-7.6, 8.1-8.6, 9.1-9.6_
  
  - [x] 2.3 运行数据库迁移
    - 生成初始迁移文件
    - 执行迁移创建数据库表
    - 生成 Prisma Client
    - _Requirements: 所有需求的数据层基础_


- [x] 3. 认证系统实现
  - [x] 3.1 配置 NextAuth.js
    - 安装 NextAuth.js 和相关依赖
    - 创建 auth 配置文件
    - 配置 JWT 策略
    - 设置 OAuth providers（Google, GitHub）
    - _Requirements: 4.1-4.7_
  
  - [x] 3.2 实现用户注册功能
    - 创建注册 API 端点
    - 实现密码哈希（使用 bcrypt）
    - 添加邮箱唯一性验证
    - 实现输入验证（Zod schema）
    - _Requirements: 4.1, 4.2_
  
  - [-] 3.3 编写用户注册属性测试

    - **Property 9: Valid Registration Creates Account**
    - **Property 10: Invalid Registration Rejected**
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 3.4 实现登录功能
    - 创建登录 API 端点
    - 实现凭证验证
    - 生成 JWT token
    - 设置会话管理
    - _Requirements: 4.3, 4.4_
  
  - [x] 3.5 编写登录属性测试

    - **Property 11: Valid Credentials Authenticate**
    - **Validates: Requirements 4.3**
  
  - [x] 3.6 实现密码重置功能
    - 创建密码重置请求 API
    - 生成安全重置 token
    - 发送重置邮件
    - 创建密码重置确认 API
    - _Requirements: 4.7_


- [ ] 4. 用户资料和地址管理
  - [x] 4.1 实现用户资料 API
    - 创建获取资料 API 端点
    - 创建更新资料 API 端点
    - 实现资料验证
    - _Requirements: 4.5_
  
  - [x] 4.2 编写资料更新属性测试

    - **Property 12: Profile Update Persistence**
    - **Validates: Requirements 4.5**
  
  - [x] 4.3 实现地址管理 API
    - 创建地址 CRUD API 端点
    - 实现地址验证
    - 支持多地址管理
    - 支持默认地址设置
    - _Requirements: 4.6, 9.5_
  
  - [ ]* 4.4 编写地址管理属性测试
    - **Property 13: Multiple Address Management**
    - **Property 32: Shipping Address Validation**
    - **Validates: Requirements 4.6, 9.5**

- [ ] 5. 国际化（i18n）设置
  - [x] 5.1 配置 next-intl
    - 安装 next-intl
    - 创建语言配置文件
    - 设置支持的语言（en, zh-CN, zh-TW, ja, ko）
    - 配置语言检测和切换
    - _Requirements: 2.1-2.5_
  
  - [x] 5.2 创建翻译文件结构
    - 创建各语言的 JSON 翻译文件
    - 定义通用 UI 文本的翻译键
    - 实现翻译回退机制（默认英语）
    - _Requirements: 2.2, 2.5_
  
  - [ ]* 5.3 编写国际化属性测试
    - **Property 4: Language Translation Completeness**
    - **Property 5: Language Preference Persistence**
    - **Validates: Requirements 2.2, 2.4**


- [ ] 6. 产品和分类管理
  - [x] 6.1 实现产品 API
    - 创建产品列表 API（支持分页、筛选、排序）
    - 创建产品详情 API
    - 创建产品搜索 API
    - 实现产品翻译支持
    - _Requirements: 1.1-1.5_
  
  - [ ]* 6.2 编写产品 API 属性测试
    - **Property 1: Category Filtering Correctness**
    - **Property 2: Product Search Relevance**
    - **Validates: Requirements 1.2, 1.4**
  
  - [x] 6.3 实现分类 API
    - 创建分类列表 API
    - 创建分类树结构 API
    - 实现分类翻译支持
    - _Requirements: 1.2_
  
  - [x] 6.4 实现管理员产品管理 API
    - 创建产品 CRUD API（仅管理员）
    - 实现产品图片上传
    - 实现库存管理 API
    - 添加权限验证
    - _Requirements: 7.1, 10.2, 10.7_
  
  - [ ]* 6.5 编写产品管理属性测试
    - **Property 20: Inventory Update Persistence**
    - **Property 33: Product CRUD Operations**
    - **Validates: Requirements 7.1, 10.2, 10.7**

- [ ] 7. 货币和汇率系统
  - [ ] 7.1 实现货币转换服务
    - 创建汇率获取服务（使用外部 API）
    - 实现汇率缓存（Redis）
    - 创建价格转换工具函数
    - 支持多货币（USD, EUR, CNY, JPY, KRW）
    - _Requirements: 5.7, 5.8_
  
  - [ ]* 7.2 编写货币转换属性测试
    - **Property 3: Currency Display Consistency**
    - **Validates: Requirements 1.5, 5.8**


- [ ] 8. 购物车功能实现
  - [x] 8.1 实现购物车 API
    - 创建获取购物车 API
    - 创建添加商品到购物车 API
    - 创建更新购物车商品数量 API
    - 创建删除购物车商品 API
    - 实现库存验证
    - _Requirements: 3.1-3.6_
  
  - [x] 8.2 实现购物车持久化
    - 为注册用户实现数据库持久化
    - 为游客实现 session 存储
    - 实现购物车合并（登录时）
    - _Requirements: 3.5_
  
  - [ ]* 8.3 编写购物车属性测试
    - **Property 6: Cart Total Calculation**
    - **Property 7: Cart Item Display Completeness**
    - **Property 8: Cart Persistence for Registered Users**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 9. Checkpoint - 验证核心功能
  - 确保所有测试通过，如有问题请询问用户。

- [x] 10. 订单处理系统
  - [x] 10.1 实现配送费用计算
    - 创建配送费率管理 API
    - 实现基于目的地和重量的费用计算
    - 支持多种配送方式
    - _Requirements: 5.2, 9.1-9.3_
  
  - [ ]* 10.2 编写配送费用属性测试
    - **Property 15: Shipping Cost Calculation**
    - **Property 30: Shipping Cost Calculation for All Methods**
    - **Validates: Requirements 5.2, 9.2**
  
  - [x] 10.3 实现订单创建 API
    - 创建订单创建端点
    - 实现订单号生成
    - 计算订单总额（商品+配送+税）
    - 验证库存可用性
    - 减少库存
    - _Requirements: 5.1, 5.5, 7.2_
  
  - [ ]* 10.4 编写订单创建属性测试
    - **Property 14: Checkout Summary Completeness**
    - **Property 21: Order Placement Decreases Inventory**
    - **Validates: Requirements 5.1, 7.2**


- [x] 11. 支付集成
  - [x] 11.1 配置 Stripe
    - 安装 Stripe SDK
    - 配置 Stripe API 密钥
    - 创建支付意图 API
    - 实现支付确认 API
    - _Requirements: 5.3, 5.4_
  
  - [ ] 11.2 配置 PayPal
    - 安装 PayPal SDK
    - 配置 PayPal API 凭证
    - 创建 PayPal 支付端点
    - _Requirements: 5.3_
  
  - [ ] 11.3 配置 Alipay
    - 配置 Alipay（通过 Stripe）
    - 创建 Alipay 支付端点
    - _Requirements: 5.3_
  
  - [x] 11.4 实现支付 webhook
    - 创建 Stripe webhook 端点
    - 验证 webhook 签名
    - 处理支付成功事件
    - 处理支付失败事件
    - 更新订单状态
    - _Requirements: 5.5, 5.6_
  
  - [ ]* 11.5 编写支付流程属性测试
    - **Property 16: Successful Payment Creates Order**
    - **Validates: Requirements 5.5**

- [ ] 12. 订单管理功能
  - [x] 12.1 实现订单查询 API
    - 创建订单历史 API
    - 创建订单详情 API
    - 实现订单筛选和排序
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 12.2 编写订单查询属性测试
    - **Property 17: Order Information Completeness**
    - **Validates: Requirements 6.1, 6.2**
  
  - [x] 12.3 实现订单取消功能
    - 创建订单取消 API
    - 验证订单状态（仅未发货订单可取消）
    - 恢复库存
    - 处理退款
    - _Requirements: 6.5, 6.6, 7.3_
  
  - [ ]* 12.4 编写订单取消属性测试
    - **Property 19: Unshipped Order Cancellation**
    - **Property 22: Order Cancellation Restores Inventory (Round-trip)**
    - **Validates: Requirements 6.5, 7.3**


  - [x] 12.5 实现订单状态更新和通知
    - 创建订单状态更新 API（管理员）
    - 实现邮件通知服务
    - 发送订单状态变更邮件
    - _Requirements: 6.3, 10.3_
  
  - [ ]* 12.6 编写订单通知属性测试
    - **Property 18: Order Status Change Notification**
    - **Property 34: Order Status Management**
    - **Validates: Requirements 6.3, 10.3**
  
  - [x] 12.7 实现物流追踪功能
    - 创建追踪号生成逻辑
    - 实现追踪信息更新 API
    - 创建追踪查询 API
    - _Requirements: 6.2, 6.4, 9.4_
  
  - [ ]* 12.8 编写物流追踪属性测试
    - **Property 31: Tracking Number Generation**
    - **Validates: Requirements 9.4**

- [ ] 13. 库存管理和并发控制
  - [ ] 13.1 实现库存验证逻辑
    - 创建库存检查函数
    - 实现库存不足拒绝逻辑
    - 添加低库存警告
    - _Requirements: 7.4, 7.5_
  
  - [ ]* 13.2 编写库存验证属性测试
    - **Property 23: Inventory Validation Prevents Overselling**
    - **Validates: Requirements 7.5**
  
  - [ ] 13.3 实现并发购买控制
    - 使用数据库事务确保原子性
    - 实现乐观锁或悲观锁
    - 处理并发冲突
    - _Requirements: 7.6_
  
  - [ ]* 13.4 编写并发控制属性测试
    - **Property 24: Concurrent Purchase Atomicity**
    - **Validates: Requirements 7.6**


- [ ] 14. 评价系统实现
  - [x] 14.1 实现评价 API
    - 创建提交评价 API
    - 验证用户购买记录
    - 验证评价唯一性（一个产品一个评价）
    - 实现评价验证（1-5星，可选评论）
    - _Requirements: 8.1, 8.2, 8.6_
  
  - [ ]* 14.2 编写评价提交属性测试
    - **Property 25: Review Permission Validation**
    - **Property 26: Review Validation Requirements**
    - **Property 29: Review Uniqueness**
    - **Validates: Requirements 8.1, 8.2, 8.6**
  
  - [x] 14.3 实现评价查询和显示
    - 创建产品评价列表 API
    - 仅显示已批准的评价
    - 实现评分统计
    - 计算平均评分
    - _Requirements: 8.3, 8.4_
  
  - [ ]* 14.4 编写评价显示属性测试
    - **Property 27: Approved Reviews Display**
    - **Property 28: Average Rating Calculation**
    - **Validates: Requirements 8.3, 8.4**
  
  - [ ] 14.5 实现评价管理功能（管理员）
    - 创建评价审核 API
    - 实现隐藏/删除评价功能
    - _Requirements: 8.5_

- [ ] 15. Checkpoint - 验证业务逻辑
  - 确保所有测试通过，如有问题请询问用户。


- [ ] 16. 前端布局组件
  - [x] 16.1 创建 Header 组件
    - 实现 logo 和导航
    - 实现语言/货币切换器
    - 实现搜索栏
    - 实现购物车图标（带数量徽章）
    - 实现用户账户菜单
    - _Requirements: 1.1, 2.2, 3.1_
  
  - [x] 16.2 创建 Footer 组件
    - 实现公司信息和链接
    - 实现社交媒体链接
    - 实现支付方式图标
    - _Requirements: 5.3_
  
  - [x] 16.3 创建 Navigation 组件
    - 实现产品分类菜单
    - 实现响应式移动菜单
    - 支持多级菜单
    - _Requirements: 1.2, 14.2_
  
  - [x] 16.4 实现响应式布局
    - 配置 Tailwind 断点
    - 实现移动端适配
    - 确保触摸友好的 UI 元素
    - _Requirements: 14.1-14.5_

- [ ] 17. 产品展示组件
  - [x] 17.1 创建 ProductCard 组件
    - 显示产品缩略图
    - 显示产品名称和价格
    - 显示评分和评论数
    - 显示库存状态
    - 实现快速添加到购物车
    - _Requirements: 1.1, 1.6_
  
  - [x] 17.2 创建 ProductDetail 组件
    - 实现产品图片画廊
    - 显示产品规格和描述
    - 显示价格和库存信息
    - 实现数量选择器
    - 实现添加到购物车按钮
    - _Requirements: 1.3_
  
  - [x] 17.3 创建 ProductGallery 组件
    - 实现主图显示
    - 实现缩略图导航
    - 实现图片缩放功能
    - 支持触摸滑动
    - _Requirements: 1.3_


- [ ] 18. 购物车和结账组件
  - [x] 18.1 创建 CartDrawer 组件
    - 实现侧边栏购物车
    - 显示所有购物车项目
    - 实现数量更新
    - 实现删除项目
    - 显示小计和总计
    - _Requirements: 3.1-3.4_
  
  - [x] 18.2 创建 CheckoutForm 组件
    - 实现配送地址表单
    - 实现配送方式选择
    - 实现支付方式选择
    - 显示订单摘要
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 18.3 创建 PaymentForm 组件
    - 集成 Stripe Elements
    - 实现信用卡输入
    - 实现 PayPal 按钮
    - 实现 Alipay 按钮
    - 显示支付处理状态
    - _Requirements: 5.3, 5.4_

- [ ] 19. 用户账户组件
  - [x] 19.1 创建 AccountDashboard 组件
    - 显示用户信息概览
    - 显示最近订单
    - 显示保存的地址
    - _Requirements: 4.5, 4.6, 6.1_
  
  - [x] 19.2 创建 OrderHistory 组件
    - 显示订单列表
    - 显示订单状态
    - 实现订单详情链接
    - 实现追踪链接
    - _Requirements: 6.1, 6.2_
  
  - [x] 19.3 创建 OrderDetail 组件
    - 显示订单信息
    - 显示订单项目列表
    - 显示配送地址
    - 显示追踪信息
    - 实现发票下载
    - _Requirements: 6.2_


- [ ] 20. 评价组件
  - [x] 20.1 创建 ReviewList 组件
    - 显示评分统计
    - 显示评论列表
    - 实现分页
    - 实现排序选项
    - _Requirements: 8.3_
  
  - [x] 20.2 创建 ReviewForm 组件
    - 实现星级评分选择器
    - 实现评论文本输入
    - 实现图片上传（可选）
    - _Requirements: 8.2_

- [ ] 21. 页面实现
  - [x] 21.1 创建首页
    - 显示特色产品
    - 实现产品分类导航
    - 实现搜索功能
    - _Requirements: 1.1, 1.4_
  
  - [x] 21.2 创建产品列表页
    - 实现产品网格布局
    - 实现筛选功能
    - 实现排序功能
    - 实现分页
    - _Requirements: 1.2, 1.4_
  
  - [x] 21.3 创建产品详情页
    - 集成 ProductDetail 组件
    - 集成 ReviewList 组件
    - 显示相关产品
    - _Requirements: 1.3, 8.3_
  
  - [x] 21.4 创建购物车页面
    - 显示购物车内容
    - 实现结账按钮
    - _Requirements: 3.2_
  
  - [x] 21.5 创建结账页面
    - 集成 CheckoutForm 组件
    - 集成 PaymentForm 组件
    - 实现多步骤结账流程
    - _Requirements: 5.1-5.8_


  - [x] 21.6 创建用户账户页面
    - 集成 AccountDashboard 组件
    - 实现资料编辑
    - 实现地址管理
    - _Requirements: 4.5, 4.6_
  
  - [x] 21.7 创建订单历史页面
    - 集成 OrderHistory 组件
    - 集成 OrderDetail 组件
    - _Requirements: 6.1, 6.2_
  
  - [x] 21.8 创建认证页面
    - 创建登录页面
    - 创建注册页面
    - 创建密码重置页面
    - _Requirements: 4.1-4.4, 4.7_

- [ ] 22. 管理后台实现
  - [x] 22.1 创建管理员仪表板
    - 显示关键指标（销售额、订单数等）
    - 显示最近订单
    - 显示低库存警告
    - _Requirements: 10.1_
  
  - [x] 22.2 创建产品管理界面
    - 实现产品列表视图
    - 实现产品创建/编辑表单
    - 实现产品删除功能
    - 实现图片上传
    - _Requirements: 10.2_
  
  - [x] 22.3 创建订单管理界面
    - 实现订单列表视图
    - 实现订单详情视图
    - 实现订单状态更新
    - _Requirements: 10.3_
  
  - [x] 22.4 创建分类管理界面
    - 实现分类 CRUD 功能
    - 实现分类层级管理
    - _Requirements: 10.5_
  
  - [ ]* 22.5 编写管理功能属性测试
    - **Property 35: Category Management**
    - **Validates: Requirements 10.5**


  - [x] 22.6 创建销售报表功能
    - 实现报表查询 API
    - 实现日期范围筛选
    - 实现产品筛选
    - 实现地区筛选
    - 显示图表和统计数据
    - _Requirements: 10.6_
  
  - [ ]* 22.7 编写销售报表属性测试
    - **Property 36: Sales Report Filtering**
    - **Validates: Requirements 10.6**

- [ ] 23. 安全性实现
  - [ ] 23.1 实现数据加密
    - 配置密码哈希（bcrypt）
    - 实现敏感数据加密
    - 确保支付信息不存储
    - _Requirements: 12.1, 12.3_
  
  - [ ]* 23.2 编写安全性属性测试
    - **Property 37: Sensitive Data Encryption**
    - **Property 38: Payment Data Non-Storage**
    - **Validates: Requirements 12.1, 12.3**
  
  - [ ] 23.3 实现 HTTPS 和安全头
    - 配置 HTTPS（Vercel 自动提供）
    - 添加安全响应头
    - 配置 CORS
    - _Requirements: 12.2_
  
  - [ ] 23.4 实现速率限制
    - 安装速率限制中间件
    - 配置登录端点速率限制
    - 配置 API 端点速率限制
    - _Requirements: 12.4_
  
  - [ ]* 23.5 编写速率限制属性测试
    - **Property 39: Rate Limiting Enforcement**
    - **Validates: Requirements 12.4**


  - [ ] 23.6 实现安全事件日志
    - 创建日志服务
    - 记录认证事件
    - 记录管理员操作
    - 集成 Sentry 错误追踪
    - _Requirements: 12.5_
  
  - [ ]* 23.7 编写安全日志属性测试
    - **Property 40: Security Event Logging**
    - **Validates: Requirements 12.5**

- [ ] 24. SEO 优化
  - [ ] 24.1 实现 SEO 元数据
    - 为所有页面添加 meta 标签
    - 实现 Open Graph 标签
    - 实现 Twitter Card 标签
    - _Requirements: 13.2_
  
  - [ ]* 24.2 编写 SEO 元数据属性测试
    - **Property 41: Product Page Meta Tags**
    - **Validates: Requirements 13.2**
  
  - [ ] 24.3 实现结构化数据
    - 为产品页面添加 Schema.org 标记
    - 实现 Product schema
    - 实现 Review schema
    - _Requirements: 13.4_
  
  - [ ]* 24.4 编写结构化数据属性测试
    - **Property 42: Structured Data Markup**
    - **Validates: Requirements 13.4**
  
  - [ ] 24.5 实现 SEO 友好 URL
    - 使用产品 slug 作为 URL
    - 确保 URL 小写和使用连字符
    - _Requirements: 13.5_
  
  - [ ]* 24.6 编写 URL 生成属性测试
    - **Property 43: SEO-Friendly URL Generation**
    - **Validates: Requirements 13.5**


  - [ ] 24.7 实现 sitemap 和 robots.txt
    - 生成动态 XML sitemap
    - 创建 robots.txt
    - 实现 sitemap 自动更新
    - _Requirements: 13.3_

- [ ] 25. 性能优化
  - [ ] 25.1 实现图片优化
    - 使用 Next.js Image 组件
    - 配置图片格式优化（WebP）
    - 实现懒加载
    - _Requirements: 11.2_
  
  - [ ] 25.2 实现缓存策略
    - 配置 Redis 缓存
    - 实现产品列表缓存
    - 实现汇率缓存
    - 实现分类树缓存
    - _Requirements: 11.3_
  
  - [ ] 25.3 实现 SSR/SSG 优化
    - 为产品页面使用 SSG
    - 为首页使用 ISR
    - 为动态内容使用 SSR
    - _Requirements: 11.1, 13.6_

- [ ] 26. Checkpoint - 验证完整功能
  - 确保所有测试通过，如有问题请询问用户。

- [ ] 27. 错误处理和用户体验
  - [ ] 27.1 实现统一错误处理
    - 创建错误处理中间件
    - 实现错误响应格式
    - 添加错误日志
    - _Requirements: 所有需求的错误处理_
  
  - [x] 27.2 创建错误页面
    - 创建 404 页面
    - 创建 500 页面
    - 创建通用错误页面
    - _Requirements: 所有需求的错误处理_


  - [ ] 27.3 实现加载状态
    - 创建加载指示器组件
    - 实现骨架屏
    - 添加加载状态到所有异步操作
    - _Requirements: 所有需求的用户体验_
  
  - [ ] 27.4 实现 Toast 通知
    - 安装 toast 库
    - 实现成功/错误/警告通知
    - 添加通知到关键操作
    - _Requirements: 所有需求的用户反馈_

- [x] 28. 邮件服务集成
  - [x] 28.1 配置邮件服务
    - 选择邮件服务提供商（如 SendGrid, Resend）
    - 配置 API 密钥
    - 创建邮件发送服务
    - _Requirements: 4.7, 5.5, 6.3_
  
  - [x] 28.2 创建邮件模板
    - 创建订单确认邮件模板
    - 创建订单状态更新邮件模板
    - 创建密码重置邮件模板
    - 创建欢迎邮件模板
    - _Requirements: 4.7, 5.5, 6.3_

- [ ] 29. 测试框架设置
  - [ ] 29.1 配置 Jest 和 Testing Library
    - 安装 Jest 和相关依赖
    - 配置 Jest 配置文件
    - 安装 React Testing Library
    - 配置测试环境
    - _Requirements: 所有需求的测试基础_
  
  - [ ] 29.2 配置 fast-check
    - 安装 fast-check
    - 创建测试数据生成器
    - 配置属性测试运行参数（100次迭代）
    - _Requirements: 所有需求的属性测试基础_


- [ ] 30. 集成测试
  - [ ]* 30.1 编写结账流程集成测试
    - 测试完整的购物到支付流程
    - 验证库存减少
    - 验证订单创建
    - 验证邮件发送
    - _Requirements: 3.1-3.6, 5.1-5.8, 7.2_
  
  - [ ]* 30.2 编写订单生命周期集成测试
    - 测试订单创建到完成的完整流程
    - 测试订单取消和退款
    - 验证库存恢复
    - _Requirements: 5.1-5.8, 6.1-6.6, 7.2, 7.3_

- [ ] 31. 部署准备
  - [ ] 31.1 配置环境变量
    - 创建 .env.example 文件
    - 文档化所有必需的环境变量
    - 配置生产环境变量
    - _Requirements: 所有需求的部署基础_
  
  - [ ] 31.2 配置数据库迁移
    - 准备生产数据库迁移脚本
    - 创建种子数据脚本
    - _Requirements: 所有需求的数据基础_
  
  - [ ] 31.3 配置 Vercel 部署
    - 创建 Vercel 项目
    - 配置构建设置
    - 配置域名
    - 配置 CDN
    - _Requirements: 11.1, 11.4_
  
  - [ ] 31.4 配置监控和分析
    - 集成 Vercel Analytics
    - 配置 Sentry 错误追踪
    - 配置 PostHog 用户分析
    - _Requirements: 所有需求的监控_

- [ ] 32. 最终 Checkpoint - 完整系统验证
  - 运行所有测试（单元测试、属性测试、集成测试）
  - 验证所有功能正常工作
  - 检查性能指标
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以确保可追溯性
- Checkpoint 任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
