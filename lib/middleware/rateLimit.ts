import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  RateLimitConfig,
  logSecurityEvent,
  getClientIP,
} from '../security';

/**
 * 速率限制中间件
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config: RateLimitConfig,
  identifier?: (request: Request) => string
) {
  return async (request: Request): Promise<Response> => {
    // 获取标识符（默认使用 IP 地址）
    const id = identifier
      ? identifier(request)
      : getClientIP(request) || 'unknown';

    // 检查速率限制
    const { allowed, remaining, resetAt } = checkRateLimit(id, config);

    // 如果超过限制，返回 429
    if (!allowed) {
      // 记录安全事件
      logSecurityEvent({
        event: 'RATE_LIMIT_EXCEEDED',
        ip: getClientIP(request) || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        details: {
          identifier: id,
          config,
        },
        severity: 'medium',
      });

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetAt).toISOString(),
          },
        }
      );
    }

    // 执行原始处理器
    const response = await handler(request);

    // 添加速率限制头
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    headers.set('X-RateLimit-Remaining', remaining.toString());
    headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

/**
 * 为 API 路由创建速率限制包装器
 */
export function createRateLimitedHandler(
  handler: (request: Request, context?: any) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: Request, context?: any): Promise<Response> => {
    const wrappedHandler = withRateLimit(
      (req) => handler(req, context),
      config
    );
    return wrappedHandler(request);
  };
}
