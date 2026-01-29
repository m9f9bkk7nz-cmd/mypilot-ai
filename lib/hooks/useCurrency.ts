'use client';

/**
 * 货币管理 Hook
 * 
 * 功能：
 * - 获取当前货币
 * - 切换货币
 * - 转换价格
 * - 格式化价格
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  type CurrencyCode, 
  DEFAULT_CURRENCY,
  convertPrice,
  formatPrice,
  getDefaultCurrencyForLocale,
  SUPPORTED_CURRENCIES
} from '@/lib/currency';

const CURRENCY_STORAGE_KEY = 'preferred_currency';

export function useCurrency(locale?: string) {
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化货币
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && stored in SUPPORTED_CURRENCIES) {
      setCurrency(stored as CurrencyCode);
    } else if (locale) {
      const defaultCurrency = getDefaultCurrencyForLocale(locale);
      setCurrency(defaultCurrency);
    }
  }, [locale]);

  // 监听货币切换事件
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail.currency as CurrencyCode);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, []);

  // 切换货币
  const changeCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    
    // 触发事件
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { currency: newCurrency } 
    }));
  }, []);

  // 转换价格
  const convert = useCallback(async (
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency?: CurrencyCode
  ): Promise<number> => {
    const targetCurrency = toCurrency || currency;
    setIsLoading(true);
    try {
      return await convertPrice(amount, fromCurrency, targetCurrency);
    } finally {
      setIsLoading(false);
    }
  }, [currency]);

  // 格式化价格
  const format = useCallback((
    amount: number,
    currencyCode?: CurrencyCode,
    locale?: string
  ): string => {
    return formatPrice(amount, currencyCode || currency, locale);
  }, [currency]);

  // 转换并格式化
  const convertAndFormat = useCallback(async (
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency?: CurrencyCode,
    locale?: string
  ): Promise<string> => {
    const targetCurrency = toCurrency || currency;
    const converted = await convert(amount, fromCurrency, targetCurrency);
    return format(converted, targetCurrency, locale);
  }, [currency, convert, format]);

  return {
    currency,
    currencyInfo: SUPPORTED_CURRENCIES[currency],
    changeCurrency,
    convert,
    format,
    convertAndFormat,
    isLoading,
  };
}
