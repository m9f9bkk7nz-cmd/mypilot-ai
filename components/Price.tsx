'use client';

/**
 * 价格显示组件
 * 
 * 功能：
 * - 显示价格
 * - 自动货币转换（带缓存）
 * - 响应货币切换
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { 
  formatPrice, 
  convertPrice, 
  type CurrencyCode,
  DEFAULT_CURRENCY 
} from '@/lib/currency';

interface PriceProps {
  amount: number;
  currency?: CurrencyCode;
  className?: string;
  showOriginal?: boolean;
}

const CURRENCY_STORAGE_KEY = 'preferred_currency';

// 货币转换缓存（避免重复 API 调用）
const conversionCache = new Map<string, { rate: number; expiresAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1小时

async function getCachedConversion(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  if (from === to) return amount;
  
  const cacheKey = `${from}-${to}`;
  const cached = conversionCache.get(cacheKey);
  
  if (cached && Date.now() < cached.expiresAt) {
    return amount * cached.rate;
  }
  
  // 调用 API 获取转换
  const converted = await convertPrice(1, from, to);
  conversionCache.set(cacheKey, {
    rate: converted,
    expiresAt: Date.now() + CACHE_TTL,
  });
  
  return amount * converted;
}

function Price({ 
  amount, 
  currency = DEFAULT_CURRENCY, 
  className = '',
  showOriginal = false 
}: PriceProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>(currency);
  const [isLoading, setIsLoading] = useState(false);

  const convertAndSetPrice = useCallback(async (toCurrency: CurrencyCode) => {
    if (toCurrency === currency) {
      setDisplayAmount(amount);
      return;
    }

    setIsLoading(true);
    try {
      const converted = await getCachedConversion(amount, currency, toCurrency);
      setDisplayAmount(converted);
    } catch (error) {
      console.error('Error converting price:', error);
      setDisplayAmount(amount);
    } finally {
      setIsLoading(false);
    }
  }, [amount, currency]);

  // 加载用户偏好的货币
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && stored !== currency) {
      setDisplayCurrency(stored as CurrencyCode);
      convertAndSetPrice(stored as CurrencyCode);
    }
  }, [currency, convertAndSetPrice]);

  // 监听货币切换事件
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      const newCurrency = event.detail.currency as CurrencyCode;
      setDisplayCurrency(newCurrency);
      convertAndSetPrice(newCurrency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, [convertAndSetPrice]);

  const formattedPrice = formatPrice(displayAmount, displayCurrency);
  const originalPrice = currency !== displayCurrency 
    ? formatPrice(amount, currency) 
    : null;

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className={`font-semibold ${isLoading ? 'opacity-50' : ''}`}>
        {formattedPrice}
      </span>
      {showOriginal && originalPrice && (
        <span className="text-xs text-gray-400">
          ({originalPrice})
        </span>
      )}
    </div>
  );
}

export default memo(Price);
