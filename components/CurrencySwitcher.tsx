'use client';

/**
 * 货币切换器组件
 * 
 * 功能：
 * - 显示当前货币
 * - 切换货币
 * - 保存用户偏好
 */

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SUPPORTED_CURRENCIES, 
  type CurrencyCode,
  getDefaultCurrencyForLocale 
} from '@/lib/currency';

const CURRENCY_STORAGE_KEY = 'preferred_currency';

export default function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const router = useRouter();
  const pathname = usePathname();

  // 从 localStorage 加载货币偏好
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && stored in SUPPORTED_CURRENCIES) {
      setCurrentCurrency(stored as CurrencyCode);
    } else {
      // 根据语言设置默认货币
      const locale = pathname.split('/')[1] || 'en';
      const defaultCurrency = getDefaultCurrencyForLocale(locale);
      setCurrentCurrency(defaultCurrency);
    }
  }, [pathname]);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setCurrentCurrency(currency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    setIsOpen(false);
    
    // 触发自定义事件，通知其他组件货币已更改
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { currency } 
    }));
    
    // 刷新页面以更新价格
    router.refresh();
  };

  const currentCurrencyInfo = SUPPORTED_CURRENCIES[currentCurrency];

  return (
    <div className="relative">
      {/* 货币按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:glass-strong transition-all duration-300"
        aria-label="Select currency"
      >
        <span className="text-lg">{currentCurrencyInfo.symbol}</span>
        <span className="text-sm font-medium">{currentCurrencyInfo.code}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 货币下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-64 glass-strong rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="p-2 border-b border-white/10">
              <p className="text-xs text-gray-400 px-3 py-2">Select Currency</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2">
              {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code as CurrencyCode)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    currentCurrency === code
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.symbol}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{info.code}</div>
                      <div className="text-xs text-gray-400">{info.name}</div>
                    </div>
                  </div>
                  
                  {currentCurrency === code && (
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
