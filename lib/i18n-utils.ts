import { locales, type Locale } from '@/i18n';

/**
 * Get the display name for a locale
 */
export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    th: 'ไทย',
    'en-AU': 'English (AU)',
  };
  return names[locale];
}

/**
 * Get all available locales with their display names
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string }> {
  return locales.map((locale) => ({
    code: locale,
    name: getLocaleName(locale),
  }));
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
