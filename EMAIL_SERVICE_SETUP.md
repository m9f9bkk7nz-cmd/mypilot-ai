# 📧 邮件服务设置指南（Resend）

## 为什么选择 Resend？

- ✅ 完全免费（每月 3,000 封邮件）
- ✅ 无需信用卡
- ✅ 专为开发者设计
- ✅ 简单易用的 API
- ✅ 支持自定义域名

---

## 快速设置（5 分钟）

### 1. 注册 Resend 账号

访问：https://resend.com

点击 "Sign Up" 或 "Get Started"

使用以下方式注册：
- GitHub 账号（推荐）
- Google 账号
- 邮箱注册

### 2. 获取 API 密钥

登录后：

1. 点击左侧菜单 "API Keys"
2. 点击 "Create API Key"
3. 输入名称（如 "MyPilot Development"）
4. 选择权限：**Full Access**（或 "Sending access"）
5. 点击 "Create"
6. **复制 API 密钥**（只显示一次！）

API 密钥格式：`re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. 更新 .env 文件

打开项目的 `.env` 文件，更新以下内容：

```env
# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="MyPilot <onboarding@resend.dev>"
```

**注意**：
- 将 `re_your_api_key_here` 替换为你的实际 API 密钥
- 免费账户只能使用 `onboarding@resend.dev` 作为发件人
- 如果要使用自定义域名（如 `noreply@mypilot.com`），需要验证域名

### 4. 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 5. 测试邮件发送

现在系统会在以下情况自动发送邮件：

✅ **用户注册** → 发送欢迎邮件
✅ **密码重置** → 发送重置链接
✅ **订单创建** → 发送订单确认邮件
✅ **订单状态更新** → 发送状态通知邮件

---

## 使用自定义域名（可选）

如果你想使用自己的域名（如 `noreply@mypilot.com`）：

### 1. 添加域名

在 Resend 控制台：

1. 点击左侧菜单 "Domains"
2. 点击 "Add Domain"
3. 输入你的域名（如 `mypilot.com`）
4. 点击 "Add"

### 2. 配置 DNS 记录

Resend 会提供 DNS 记录，你需要在域名提供商处添加：

**SPF 记录**：
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

**DKIM 记录**：
```
Type: TXT
Name: resend._domainkey
Value: [Resend 提供的值]
```

**DMARC 记录**（可选）：
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@mypilot.com
```

### 3. 验证域名

添加 DNS 记录后：

1. 返回 Resend 控制台
2. 点击 "Verify"
3. 等待验证完成（可能需要几分钟到几小时）

### 4. 更新发件人地址

验证成功后，更新 `.env` 文件：

```env
EMAIL_FROM="MyPilot <noreply@mypilot.com>"
```

---

## 邮件模板说明

系统包含以下邮件模板：

### 1. 欢迎邮件
**触发时机**：用户注册成功
**内容**：
- 欢迎信息
- 开始购物按钮

### 2. 密码重置邮件
**触发时机**：用户请求重置密码
**内容**：
- 重置密码链接
- 链接有效期（1 小时）

### 3. 订单确认邮件
**触发时机**：订单创建成功
**内容**：
- 订单号
- 订单商品列表
- 价格明细（小计、配送费、税费、总计）
- 配送地址
- 查看订单详情按钮

### 4. 订单状态更新邮件
**触发时机**：订单状态变更
**内容**：
- 订单号
- 新状态
- 物流追踪号（如果有）
- 查看订单详情按钮

**支持的状态**：
- `PROCESSING` - 订单处理中
- `SHIPPED` - 已发货
- `DELIVERED` - 已送达
- `CANCELLED` - 已取消

---

## 开发模式

如果没有配置 `RESEND_API_KEY`，系统会：

- ✅ 继续正常运行
- ✅ 在控制台输出邮件信息
- ❌ 不会实际发送邮件

这样你可以在开发时不需要配置邮件服务。

---

## 监控和日志

### 查看发送记录

在 Resend 控制台：

1. 点击左侧菜单 "Emails"
2. 查看所有发送的邮件
3. 点击邮件查看详情（状态、打开率、点击率等）

### 控制台日志

系统会在控制台输出邮件发送状态：

```
✅ Email sent successfully to: user@example.com
```

或

```
❌ Failed to send email: [错误信息]
```

---

## 免费额度限制

Resend 免费计划：

- ✅ 每月 3,000 封邮件
- ✅ 每天 100 封邮件
- ✅ 1 个自定义域名
- ✅ 基础分析

对于开发和小型项目完全够用！

如果需要更多：
- Pro 计划：$20/月，50,000 封邮件
- Business 计划：$80/月，100,000 封邮件

---

## 常见问题

### Q: 邮件没有发送？
A: 检查：
1. `RESEND_API_KEY` 是否正确配置
2. API 密钥是否有效
3. 控制台是否有错误信息
4. Resend 控制台查看发送记录

### Q: 邮件进入垃圾箱？
A: 
1. 使用自定义域名并配置 SPF/DKIM
2. 避免使用垃圾邮件关键词
3. 确保邮件内容质量

### Q: 如何测试邮件？
A: 
1. 注册一个新账户
2. 请求密码重置
3. 创建一个测试订单
4. 在 Resend 控制台查看发送记录

### Q: 可以使用其他邮件服务吗？
A: 可以！修改 `lib/email.ts` 文件，替换为：
- SendGrid
- Mailgun
- AWS SES
- Postmark
等其他服务

---

## 生产环境建议

### 1. 使用自定义域名
- 提高邮件送达率
- 增强品牌形象
- 避免被标记为垃圾邮件

### 2. 配置 DMARC
- 防止邮件欺诈
- 提高安全性

### 3. 监控发送状态
- 定期检查 Resend 控制台
- 设置错误告警
- 跟踪打开率和点击率

### 4. 优化邮件内容
- 使用响应式设计
- 测试不同邮件客户端
- 添加纯文本版本

---

## 🎉 完成！

邮件服务已经配置完成！现在你的系统可以：

✅ 发送欢迎邮件
✅ 发送密码重置邮件
✅ 发送订单确认邮件
✅ 发送订单状态更新邮件

试试注册一个新账户或创建一个订单，看看邮件效果吧！

---

## 下一步

1. **配置 Resend API 密钥**（5 分钟）
2. **测试邮件发送**
3. **（可选）配置自定义域名**
4. **继续开发其他功能**

需要帮助？查看 Resend 文档：https://resend.com/docs
