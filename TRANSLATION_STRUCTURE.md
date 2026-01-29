# Translation File Structure Documentation

## Overview

This document describes the translation file structure for the MyPilot website, which supports 5 languages with a comprehensive fallback mechanism.

## Supported Languages

The system supports the following languages as defined in Requirements 2.1:

1. **English (en)** - Default/Fallback language
2. **Simplified Chinese (zh-CN)** - 简体中文
3. **Traditional Chinese (zh-TW)** - 繁體中文
4. **Japanese (ja)** - 日本語
5. **Korean (ko)** - 한국어

## File Structure

All translation files are located in the `messages/` directory:

```
messages/
├── en.json       # English (default)
├── zh-CN.json    # Simplified Chinese
├── zh-TW.json    # Traditional Chinese
├── ja.json       # Japanese
└── ko.json       # Korean
```

## Translation Keys Organization

Translation keys are organized into logical namespaces for better maintainability:

### 1. Common (`common`)
General UI elements used throughout the application:
- Welcome messages
- Action buttons (save, cancel, confirm, etc.)
- Status messages (loading, error, success)
- Basic navigation (back, next, previous)

**Total keys: 21**

### 2. Navigation (`nav`)
Main navigation menu items:
- Primary navigation (home, products, categories)
- User account navigation (orders, addresses, settings)
- Information pages (about, contact)

**Total keys: 9**

### 3. Product (`product`)
Product-related UI elements:
- Product display (title, price, quantity)
- Product actions (add to cart)
- Product information (description, specifications, reviews)
- Stock status indicators

**Total keys: 11**

### 4. Cart (`cart`)
Shopping cart functionality:
- Cart display and management
- Cart actions (checkout, remove items)
- Cart calculations (subtotal, total)

**Total keys: 8**

### 5. Checkout (`checkout`)
Checkout process:
- Checkout steps (shipping, payment)
- Order summary
- Processing states

**Total keys: 7**

### 6. Authentication (`auth`)
User authentication:
- Login and registration forms
- Password management
- Form fields and labels

**Total keys: 12**

### 7. Orders (`order`)
Order management:
- Order display and tracking
- Order status labels
- Order actions

**Total keys: 14**

### 8. Footer (`footer`)
Footer content:
- Company information
- Support links
- Legal information
- Copyright notice

**Total keys: 14**

## Total Coverage

- **Total translation keys: 96**
- **Languages: 5**
- **Total translations: 480** (96 keys × 5 languages)

## Fallback Mechanism

The translation system implements a robust fallback mechanism as required by Requirement 2.5:

### Configuration

The fallback mechanism is configured in `i18n.ts`:

```typescript
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const validatedLocale = locale || defaultLocale;
  
  if (!locales.includes(validatedLocale as Locale)) {
    notFound();
  }

  return {
    locale: validatedLocale,
    messages: (await import(`./messages/${validatedLocale}.json`)).default,
  };
});
```

### Fallback Behavior

1. **Missing Translation Keys**: If a translation key is missing in the selected language, next-intl automatically falls back to the default locale (English).

2. **Invalid Locale**: If an invalid locale is requested, the system returns a 404 error.

3. **Missing Locale Parameter**: If no locale is specified, the system defaults to English.

### Language Detection

The middleware (`middleware.ts`) implements automatic language detection:

```typescript
export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,  // Enables automatic detection
  localePrefix: 'as-needed',
});
```

Detection priority:
1. **Cookie** (`NEXT_LOCALE`) - User's saved preference
2. **Accept-Language header** - Browser language setting
3. **Default locale** - English (en)

## Usage Examples

### In Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function ProductCard() {
  const t = useTranslations('product');
  
  return (
    <button>{t('addToCart')}</button>
  );
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function CartButton() {
  const t = useTranslations('cart');
  
  return (
    <button>{t('checkout')}</button>
  );
}
```

### Nested Keys

```typescript
const t = useTranslations('common');

// Access nested keys with dot notation
<p>{t('welcome')}</p>
<button>{t('save')}</button>
```

## Verification

A verification script is provided to ensure all translation files remain consistent:

```bash
node scripts/verify-translations.js
```

This script:
- Loads all translation files
- Compares keys across all languages
- Reports missing or extra keys
- Validates file structure

### Verification Results

Current status: ✅ **All translation files are consistent**

- All 5 language files contain exactly 96 keys
- No missing translations
- No extra translations
- All keys match the reference (English)

## Adding New Translations

When adding new translation keys:

1. **Add to English first** (`messages/en.json`) - This is the reference
2. **Add to all other languages** - Maintain consistency
3. **Run verification** - Ensure no keys are missing
4. **Test fallback** - Verify fallback works if a key is missing

### Example: Adding a New Key

1. Add to `messages/en.json`:
```json
{
  "product": {
    "compareProducts": "Compare Products"
  }
}
```

2. Add to all other language files with appropriate translations

3. Run verification:
```bash
node scripts/verify-translations.js
```

## Best Practices

1. **Use Namespaces**: Organize keys into logical namespaces (common, product, cart, etc.)
2. **Descriptive Keys**: Use clear, descriptive key names (e.g., `addToCart` not `btn1`)
3. **Consistency**: Keep the same structure across all language files
4. **Verification**: Run the verification script before committing changes
5. **Fallback Testing**: Test that fallback to English works correctly
6. **No Hardcoded Text**: All user-facing text should use translations

## Requirements Validation

This translation structure satisfies the following requirements:

- ✅ **Requirement 2.1**: Supports English, Chinese (Simplified), Chinese (Traditional), Japanese, and Korean
- ✅ **Requirement 2.2**: All UI elements have translations in all supported languages
- ✅ **Requirement 2.3**: Browser language detection implemented via middleware
- ✅ **Requirement 2.4**: Language preference persisted via cookies
- ✅ **Requirement 2.5**: Fallback to English when content unavailable

## Maintenance

### Regular Tasks

1. **Verify consistency** after any translation changes
2. **Update documentation** when adding new namespaces
3. **Review translations** with native speakers periodically
4. **Monitor fallback usage** to identify missing translations

### Tools

- `scripts/verify-translations.js` - Consistency verification
- `scripts/verify-translations.ts` - TypeScript version (requires tsx)

## Related Files

- `i18n.ts` - Main i18n configuration
- `middleware.ts` - Language detection and routing
- `navigation.ts` - Internationalized navigation helpers
- `messages/*.json` - Translation files

## Support

For questions or issues with translations:
1. Check this documentation
2. Run the verification script
3. Review the i18n configuration
4. Test the fallback mechanism
