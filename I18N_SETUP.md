# Internationalization (i18n) Setup

This document describes the internationalization setup for the MyPilot website using `next-intl`.

## Supported Languages

The application supports the following languages:

- **English (en)** - Default language
- **Simplified Chinese (zh-CN)** - 简体中文
- **Traditional Chinese (zh-TW)** - 繁體中文
- **Japanese (ja)** - 日本語
- **Korean (ko)** - 한국어

## Configuration Files

### Core Configuration

- **`i18n.ts`** - Main i18n configuration file that defines supported locales and loads translation messages
- **`middleware.ts`** - Next.js middleware for automatic locale detection and routing
- **`navigation.ts`** - Typed navigation utilities for locale-aware routing

### Translation Files

Translation files are located in the `messages/` directory:

- `messages/en.json` - English translations
- `messages/zh-CN.json` - Simplified Chinese translations
- `messages/zh-TW.json` - Traditional Chinese translations
- `messages/ja.json` - Japanese translations
- `messages/ko.json` - Korean translations

## Features

### 1. Automatic Language Detection

The middleware automatically detects the user's preferred language based on:

1. **Cookie** - `NEXT_LOCALE` cookie (persists user preference)
2. **Accept-Language Header** - Browser language settings
3. **Default Locale** - Falls back to English if no match

### 2. Language Persistence

User language preferences are automatically saved in a cookie and persist across sessions.

### 3. SEO-Friendly URLs

The application uses locale prefixes in URLs:

- English (default): `/` or `/en/`
- Chinese: `/zh-CN/`, `/zh-TW/`
- Japanese: `/ja/`
- Korean: `/ko/`

The default locale (English) can be accessed with or without the `/en/` prefix.

### 4. Language Switcher Component

The `LanguageSwitcher` component allows users to change languages:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Use in any component
<LanguageSwitcher />
```

## Usage

### Using Translations in Server Components

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return <h1>{t('welcome')}</h1>;
}
```

### Using Translations in Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyClientComponent() {
  const t = useTranslations('nav');
  
  return <nav>{t('home')}</nav>;
}
```

### Creating Locale-Aware Links

Use the custom `Link` component from `navigation.ts`:

```tsx
import { Link } from '@/navigation';

<Link href="/products">Products</Link>
```

This automatically includes the current locale in the URL.

### Programmatic Navigation

```tsx
'use client';

import { useRouter } from '@/navigation';

export default function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/products');
  };
  
  return <button onClick={handleClick}>Go to Products</button>;
}
```

## Adding New Translations

### 1. Add Translation Keys

Add new keys to all translation files in the `messages/` directory:

```json
// messages/en.json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

```json
// messages/zh-CN.json
{
  "mySection": {
    "myKey": "我的中文文本"
  }
}
```

### 2. Use in Components

```tsx
const t = useTranslations('mySection');
return <p>{t('myKey')}</p>;
```

## Translation Structure

Translations are organized by namespace:

- **`common`** - Common UI elements (buttons, labels, etc.)
- **`nav`** - Navigation menu items
- **`product`** - Product-related text
- **`cart`** - Shopping cart text
- **`checkout`** - Checkout process text
- **`auth`** - Authentication forms
- **`order`** - Order management text
- **`footer`** - Footer content

## Fallback Behavior

If a translation is missing for a specific locale, the system falls back to English:

1. Try to load the requested locale
2. If translation key is missing, use English translation
3. If English translation is also missing, display the key itself

## Testing Different Locales

### Method 1: URL Parameter

Navigate directly to a locale-specific URL:
- `http://localhost:3000/en`
- `http://localhost:3000/zh-CN`
- `http://localhost:3000/ja`

### Method 2: Language Switcher

Use the language switcher component in the UI.

### Method 3: Browser Settings

Set your browser's preferred language to test automatic detection.

### Method 4: Cookie

Set the `NEXT_LOCALE` cookie manually in browser DevTools.

## Best Practices

1. **Always use translation keys** - Never hardcode text in components
2. **Organize by namespace** - Group related translations together
3. **Keep keys descriptive** - Use clear, semantic key names
4. **Maintain consistency** - Use the same key structure across all locales
5. **Test all languages** - Verify translations display correctly in all supported languages
6. **Handle pluralization** - Use next-intl's plural support for countable items
7. **Format dates and numbers** - Use next-intl's formatting utilities for locale-specific formats

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 2.1** ✅ - Supports English, Simplified Chinese, Traditional Chinese, Japanese, and Korean
- **Requirement 2.2** ✅ - All UI elements display in the selected language
- **Requirement 2.3** ✅ - Automatic language detection based on browser settings
- **Requirement 2.4** ✅ - Language preference persists across sessions via cookie
- **Requirement 2.5** ✅ - Falls back to English when translations are unavailable

## Troubleshooting

### Translations not loading

1. Check that the locale is included in `i18n.ts`
2. Verify the translation file exists in `messages/[locale].json`
3. Ensure the JSON is valid (no syntax errors)
4. Clear browser cache and cookies

### Language not switching

1. Check that middleware is configured correctly
2. Verify the locale is in the `locales` array
3. Check browser console for errors
4. Clear the `NEXT_LOCALE` cookie

### 404 errors on locale routes

1. Ensure `generateStaticParams` is implemented in `app/[locale]/layout.tsx`
2. Verify middleware matcher pattern is correct
3. Check that the locale parameter is being passed correctly

## Future Enhancements

- Add RTL (Right-to-Left) support for Arabic/Hebrew
- Implement dynamic translation loading for better performance
- Add translation management UI for non-developers
- Integrate with translation management services (e.g., Crowdin, Lokalise)
- Add A/B testing for different translations
