import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
// zh-CN: 简体中文, zh-TW: 繁體中文, en: English, ja: 日本語, ko: 한국어
// ar: العربية (阿联酋/阿拉伯语), th: ไทย (泰语), en-AU: English (澳洲)
export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'ar', 'th', 'en-AU'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validatedLocale = locale || defaultLocale;
  
  if (!locales.includes(validatedLocale as Locale)) {
    notFound();
  }

  return {
    locale: validatedLocale,
    messages: (await import(`./messages/${validatedLocale}.json`)).default,
  };
});
