/**
 * 货币转换系统
 * 
 * 功能：
 * - 获取实时汇率
 * - 价格转换
 * - 货币格式化
 * - 缓存汇率数据
 */

import { getCache, setCache } from './cache';

// 支持的货币列表
export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  KRW: { code: 'KRW', symbol: '₩', name: 'Korean Won', locale: 'ko-KR' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', locale: 'zh-TW' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// 默认货币
export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

// 汇率缓存键
const EXCHANGE_RATES_CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 3600; // 1小时

// 汇率数据接口
interface ExchangeRates {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  timestamp: number;
}

/**
 * 获取汇率数据
 * 使用免费的汇率 API（exchangerate-api.com）
 */
export async function getExchangeRates(
  baseCurrency: CurrencyCode = DEFAULT_CURRENCY
): Promise<ExchangeRates> {
  // 尝试从缓存获取
  const cacheKey = `${EXCHANGE_RATES_CACHE_KEY}_${baseCurrency}`;
  const cached = await getCache<ExchangeRates>(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    // 使用免费的汇率 API
    // 如果有 API Key，使用环境变量
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const apiUrl = apiKey
      ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
      : `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();

    // 标准化响应格式
    const rates: ExchangeRates = {
      base: baseCurrency,
      rates: data.conversion_rates || data.rates,
      timestamp: Date.now(),
    };

    // 缓存汇率数据
    await setCache(cacheKey, rates, { ttl: CACHE_DURATION });

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // 返回默认汇率（1:1）
    return getFallbackRates(baseCurrency);
  }
}

/**
 * 获取备用汇率（当 API 失败时）
 */
function getFallbackRates(baseCurrency: CurrencyCode): ExchangeRates {
  const rates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>;
  
  // 所有货币对基础货币的汇率都是 1
  Object.keys(SUPPORTED_CURRENCIES).forEach((currency) => {
    rates[currency as CurrencyCode] = 1;
  });

  return {
    base: baseCurrency,
    rates,
    timestamp: Date.now(),
  };
}

/**
 * 转换价格
 */
export async function convertPrice(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  // 如果货币相同，直接返回
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    // 获取汇率
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates.rates[toCurrency];

    if (!rate) {
      console.warn(`Exchange rate not found for ${toCurrency}`);
      return amount;
    }

    // 转换价格
    return amount * rate;
  } catch (error) {
    console.error('Error converting price:', error);
    return amount;
  }
}

/**
 * 批量转换价格
 */
export async function convertPrices(
  amounts: number[],
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number[]> {
  if (fromCurrency === toCurrency) {
    return amounts;
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates.rates[toCurrency];

    if (!rate) {
      return amounts;
    }

    return amounts.map((amount) => amount * rate);
  } catch (error) {
    console.error('Error converting prices:', error);
    return amounts;
  }
}

/**
 * 格式化价格
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode,
  locale?: string
): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  const displayLocale = locale || currencyInfo.locale;

  try {
    return new Intl.NumberFormat(displayLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // 备用格式化
    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  }
}

/**
 * 格式化价格（带转换）
 */
export async function formatConvertedPrice(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  locale?: string
): Promise<string> {
  const convertedAmount = await convertPrice(amount, fromCurrency, toCurrency);
  return formatPrice(convertedAmount, toCurrency, locale);
}

/**
 * 获取货币信息
 */
export function getCurrencyInfo(currency: CurrencyCode) {
  return SUPPORTED_CURRENCIES[currency];
}

/**
 * 获取所有支持的货币
 */
export function getAllCurrencies() {
  return Object.values(SUPPORTED_CURRENCIES);
}

/**
 * 验证货币代码
 */
export function isValidCurrency(currency: string): currency is CurrencyCode {
  return currency in SUPPORTED_CURRENCIES;
}

/**
 * 从用户偏好或地区获取默认货币
 */
export function getDefaultCurrencyForLocale(locale: string): CurrencyCode {
  const localeMap: Record<string, CurrencyCode> = {
    'en': 'USD',
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'zh-CN': 'CNY',
    'zh-TW': 'TWD',
    'zh-HK': 'HKD',
    'ja': 'JPY',
    'ja-JP': 'JPY',
    'ko': 'KRW',
    'ko-KR': 'KRW',
    'de': 'EUR',
    'fr': 'EUR',
    'es': 'EUR',
    'it': 'EUR',
  };

  return localeMap[locale] || DEFAULT_CURRENCY;
}

/**
 * 获取汇率（用于显示）
 */
export async function getExchangeRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    return rates.rates[toCurrency] || 1;
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    return 1;
  }
}

/**
 * 清除汇率缓存
 */
export async function clearExchangeRatesCache(): Promise<void> {
  const currencies = Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[];
  
  for (const currency of currencies) {
    const cacheKey = `${EXCHANGE_RATES_CACHE_KEY}_${currency}`;
    await cache.delete(cacheKey);
  }
}
