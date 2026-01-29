/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 延迟加载图片
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
) {
  if (placeholder) {
    img.src = placeholder;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  observer.observe(img);
}

/**
 * 预加载资源
 */
export function preloadResource(url: string, as: string = 'fetch') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * 预连接到域名
 */
export function preconnect(url: string) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * DNS 预解析
 */
export function dnsPrefetch(url: string) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * 测量性能
 */
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
}

/**
 * 异步测量性能
 */
export async function measurePerformanceAsync(
  name: string,
  fn: () => Promise<void>
) {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') {
    return null;
  }

  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return null;
  }

  return {
    // DNS 查询时间
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    
    // TCP 连接时间
    tcp: navigation.connectEnd - navigation.connectStart,
    
    // SSL 握手时间
    ssl: navigation.secureConnectionStart
      ? navigation.connectEnd - navigation.secureConnectionStart
      : 0,
    
    // 请求时间
    request: navigation.responseStart - navigation.requestStart,
    
    // 响应时间
    response: navigation.responseEnd - navigation.responseStart,
    
    // DOM 解析时间
    domParse: navigation.domInteractive - navigation.responseEnd,
    
    // DOM 内容加载完成时间
    domContentLoaded:
      navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    
    // 页面加载完成时间
    load: navigation.loadEventEnd - navigation.loadEventStart,
    
    // 总时间
    total: navigation.loadEventEnd - navigation.fetchStart,
    
    // 首次内容绘制 (FCP)
    fcp: getFCP(),
    
    // 最大内容绘制 (LCP)
    lcp: getLCP(),
    
    // 首次输入延迟 (FID)
    fid: getFID(),
    
    // 累积布局偏移 (CLS)
    cls: getCLS(),
  };
}

/**
 * 获取首次内容绘制 (FCP)
 */
function getFCP(): number | null {
  const entries = performance.getEntriesByName('first-contentful-paint');
  return entries.length > 0 ? entries[0].startTime : null;
}

/**
 * 获取最大内容绘制 (LCP)
 */
function getLCP(): number | null {
  const entries = performance.getEntriesByType('largest-contentful-paint');
  return entries.length > 0 ? entries[entries.length - 1].startTime : null;
}

/**
 * 获取首次输入延迟 (FID)
 */
function getFID(): number | null {
  const entries = performance.getEntriesByType('first-input');
  return entries.length > 0
    ? (entries[0] as any).processingStart - entries[0].startTime
    : null;
}

/**
 * 获取累积布局偏移 (CLS)
 */
function getCLS(): number {
  let cls = 0;
  const entries = performance.getEntriesByType('layout-shift');
  
  entries.forEach((entry: any) => {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  });
  
  return cls;
}

/**
 * 报告 Web Vitals
 */
export function reportWebVitals(metric: any) {
  // 发送到分析服务
  console.log(metric);
  
  // TODO: 发送到 Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     event_label: metric.id,
  //     non_interaction: true,
  //   });
  // }
}

/**
 * 批量处理
 */
export function batchProcess<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void[]> {
  const batches: T[][] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  return Promise.all(batches.map(processor));
}

/**
 * 并发控制
 */
export async function concurrentLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}
