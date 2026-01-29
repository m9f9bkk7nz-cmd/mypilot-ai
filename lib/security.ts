/**
 * 安全性服务
 * 实现速率限制、安全日志等功能
 */

// 简单的内存存储（生产环境应使用 Redis）
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const securityLogs: SecurityLog[] = [];

export interface SecurityLog {
  timestamp: Date;
  event: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  maxRequests: number; // 最大请求数
}

/**
 * 速率限制配置
 */
export const RATE_LIMITS = {
  // 登录：每15分钟最多5次尝试
  login: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  // 注册：每小时最多3次
  register: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
  },
  // 密码重置：每小时最多3次
  passwordReset: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
  },
  // API 调用：每分钟最多60次
  api: {
    windowMs: 60 * 1000,
    maxRequests: 60,
  },
  // 订单创建：每小时最多10次
  orderCreation: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
  },
} as const;

/**
 * 检查速率限制
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;

  // 获取或创建速率限制记录
  let record = rateLimitStore.get(key);

  // 如果记录不存在或已过期，创建新记录
  if (!record || now > record.resetAt) {
    record = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
  }

  // 增加计数
  record.count++;

  // 检查是否超过限制
  const allowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
  };
}

/**
 * 重置速率限制（用于测试或管理员操作）
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * 清理过期的速率限制记录
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// 定期清理（每小时）
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 60 * 60 * 1000);
}

/**
 * 记录安全事件
 */
export function logSecurityEvent(log: Omit<SecurityLog, 'timestamp'>): void {
  const fullLog: SecurityLog = {
    ...log,
    timestamp: new Date(),
  };

  securityLogs.push(fullLog);

  // 控制台输出（生产环境应发送到日志服务）
  console.log('[SECURITY]', {
    timestamp: fullLog.timestamp.toISOString(),
    event: fullLog.event,
    severity: fullLog.severity,
    userId: fullLog.userId,
    ip: fullLog.ip,
  });

  // 保持最近1000条日志
  if (securityLogs.length > 1000) {
    securityLogs.shift();
  }

  // 如果是高危事件，立即告警（生产环境应发送到监控系统）
  if (fullLog.severity === 'critical' || fullLog.severity === 'high') {
    console.error('[SECURITY ALERT]', fullLog);
  }
}

/**
 * 获取安全日志
 */
export function getSecurityLogs(
  limit: number = 100,
  severity?: SecurityLog['severity']
): SecurityLog[] {
  let logs = securityLogs;

  if (severity) {
    logs = logs.filter((log) => log.severity === severity);
  }

  return logs.slice(-limit).reverse();
}

/**
 * 检测可疑活动
 */
export function detectSuspiciousActivity(
  userId: string,
  activityType: string
): boolean {
  // 检查最近的活动
  const recentLogs = securityLogs
    .filter(
      (log) =>
        log.userId === userId &&
        log.event === activityType &&
        Date.now() - log.timestamp.getTime() < 60 * 60 * 1000 // 最近1小时
    )
    .length;

  // 如果1小时内同类活动超过10次，标记为可疑
  return recentLogs > 10;
}

/**
 * 验证请求来源
 */
export function validateRequestOrigin(
  origin: string | null,
  allowedOrigins: string[]
): boolean {
  if (!origin) return false;

  return allowedOrigins.some((allowed) => {
    if (allowed === '*') return true;
    if (allowed.endsWith('*')) {
      const prefix = allowed.slice(0, -1);
      return origin.startsWith(prefix);
    }
    return origin === allowed;
  });
}

/**
 * 生成安全令牌
 */
export function generateSecureToken(length: number = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 清理敏感数据（用于日志）
 */
export function sanitizeForLog(data: any): any {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'creditCard',
    'ssn',
  ];

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data };

  for (const key in sanitized) {
    if (
      sensitiveFields.some((field) =>
        key.toLowerCase().includes(field.toLowerCase())
      )
    ) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * IP 地址验证
 */
export function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Regex =
    /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6
  const ipv6Regex =
    /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * 获取客户端 IP
 */
export function getClientIP(request: Request): string | null {
  // 检查常见的代理头
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for 可能包含多个 IP，取第一个
      const ip = value.split(',')[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  return null;
}
