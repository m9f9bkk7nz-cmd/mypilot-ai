'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/performance';

/**
 * 性能监控组件
 * 自动收集和报告 Web Vitals 指标
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // 监听性能指标
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // 监听 LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          reportWebVitals({
            name: 'LCP',
            value: lastEntry.startTime,
            id: 'lcp',
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // 监听 FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            reportWebVitals({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: 'fid',
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }

      // 监听 CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              reportWebVitals({
                name: 'CLS',
                value: clsValue,
                id: 'cls',
              });
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }

      // 监听 FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            reportWebVitals({
              name: 'FCP',
              value: entry.startTime,
              id: 'fcp',
            });
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // FCP not supported
      }

      // 监听 TTFB (Time to First Byte)
      try {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
          reportWebVitals({
            name: 'TTFB',
            value: navEntry.responseStart - navEntry.requestStart,
            id: 'ttfb',
          });
        }
      } catch (e) {
        // TTFB not supported
      }
    }
  }, []);

  return null; // 这是一个无 UI 的监控组件
}
