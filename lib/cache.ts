/**
 * 缓存工具函数
 * 支持内存缓存（可扩展 Redis）
 */

// 内存缓存存储
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

/**
 * 缓存配置
 */
export interface CacheConfig {
  ttl?: number; // 过期时间（秒）
}

/**
 * 获取缓存
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const cached = memoryCache.get(key);
  
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.value as T;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * 设置缓存
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheConfig = {}
): Promise<void> {
  const { ttl = 3600 } = options;
  const expiresAt = Date.now() + ttl * 1000;
  memoryCache.set(key, { value, expiresAt });
}

/**
 * 删除缓存
 */
export async function deleteCache(key: string): Promise<void> {
  memoryCache.delete(key);
}

/**
 * 清空所有缓存
 */
export async function clearCache(): Promise<void> {
  memoryCache.clear();
}

/**
 * 缓存装饰器
 * 用于缓存函数结果
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheConfig & { keyPrefix?: string } = {}
): T {
  const { keyPrefix = fn.name, ttl = 3600 } = options;

  return (async (...args: any[]) => {
    // 生成缓存键
    const key = `${keyPrefix}:${JSON.stringify(args)}`;

    // 尝试从缓存获取
    const cached = await getCache(key);
    if (cached !== null) {
      return cached;
    }

    // 执行函数
    const result = await fn(...args);

    // 存储到缓存
    await setCache(key, result, { ttl });

    return result;
  }) as T;
}

/**
 * 清理过期的内存缓存
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  memoryCache.forEach((value, key) => {
    if (now >= value.expiresAt) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => memoryCache.delete(key));
}

// 定期清理过期缓存（每 5 分钟）
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}
