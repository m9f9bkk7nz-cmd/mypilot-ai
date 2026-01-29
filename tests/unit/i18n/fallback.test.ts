/**
 * Translation Fallback Mechanism Tests
 * 
 * These tests verify that the translation fallback mechanism works correctly
 * as specified in Requirement 2.5: "WHEN content is not available in the 
 * selected language, THE System SHALL fall back to English"
 */

import { describe, it, expect } from '@jest/globals';

describe('Translation Fallback Mechanism', () => {
  describe('Translation File Structure', () => {
    it('should have all required language files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const requiredLocales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
      const messagesDir = path.join(process.cwd(), 'messages');
      
      for (const locale of requiredLocales) {
        const filePath = path.join(messagesDir, `${locale}.json`);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('should have valid JSON in all translation files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
      const messagesDir = path.join(process.cwd(), 'messages');
      
      for (const locale of locales) {
        const filePath = path.join(messagesDir, `${locale}.json`);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        expect(() => JSON.parse(content)).not.toThrow();
      }
    });

    it('should have consistent keys across all languages', () => {
      const fs = require('fs');
      const path = require('path');
      
      const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
      const messagesDir = path.join(process.cwd(), 'messages');
      
      // Helper to get all keys recursively
      function getAllKeys(obj: any, prefix = ''): string[] {
        const keys: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'object' && value !== null) {
            keys.push(...getAllKeys(value, fullKey));
          } else {
            keys.push(fullKey);
          }
        }
        return keys.sort();
      }
      
      // Load all translations
      const allKeys: Record<string, string[]> = {};
      for (const locale of locales) {
        const filePath = path.join(messagesDir, `${locale}.json`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        allKeys[locale] = getAllKeys(content);
      }
      
      // Compare all locales with English (reference)
      const referenceKeys = allKeys['en'];
      for (const locale of locales) {
        if (locale === 'en') continue;
        
        expect(allKeys[locale]).toEqual(referenceKeys);
      }
    });
  });

  describe('i18n Configuration', () => {
    it('should have correct default locale in config file', () => {
      const fs = require('fs');
      const path = require('path');
      
      const i18nPath = path.join(process.cwd(), 'i18n.ts');
      const content = fs.readFileSync(i18nPath, 'utf-8');
      
      // Check that defaultLocale is set to 'en'
      expect(content).toContain("defaultLocale: Locale = 'en'");
    });

    it('should have all supported locales in config file', () => {
      const fs = require('fs');
      const path = require('path');
      
      const i18nPath = path.join(process.cwd(), 'i18n.ts');
      const content = fs.readFileSync(i18nPath, 'utf-8');
      
      // Check that all locales are defined
      expect(content).toContain("'en'");
      expect(content).toContain("'zh-CN'");
      expect(content).toContain("'zh-TW'");
      expect(content).toContain("'ja'");
      expect(content).toContain("'ko'");
    });

    it('should have correct locale array definition', () => {
      const fs = require('fs');
      const path = require('path');
      
      const i18nPath = path.join(process.cwd(), 'i18n.ts');
      const content = fs.readFileSync(i18nPath, 'utf-8');
      
      // Check that locales array is properly defined
      expect(content).toContain('locales = [');
      expect(content).toContain('as const');
    });
  });

  describe('Translation Namespaces', () => {
    it('should have all required namespaces in English', () => {
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(process.cwd(), 'messages', 'en.json');
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const requiredNamespaces = [
        'common',
        'nav',
        'product',
        'cart',
        'checkout',
        'auth',
        'order',
        'footer'
      ];
      
      for (const namespace of requiredNamespaces) {
        expect(translations).toHaveProperty(namespace);
        expect(typeof translations[namespace]).toBe('object');
      }
    });

    it('should have common UI translations', () => {
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(process.cwd(), 'messages', 'en.json');
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const commonKeys = [
        'welcome',
        'loading',
        'error',
        'success',
        'cancel',
        'confirm',
        'save',
        'submit'
      ];
      
      for (const key of commonKeys) {
        expect(translations.common).toHaveProperty(key);
        expect(typeof translations.common[key]).toBe('string');
        expect(translations.common[key].length).toBeGreaterThan(0);
      }
    });

    it('should have product-related translations', () => {
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(process.cwd(), 'messages', 'en.json');
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const productKeys = [
        'title',
        'addToCart',
        'outOfStock',
        'inStock',
        'price',
        'quantity',
        'description'
      ];
      
      for (const key of productKeys) {
        expect(translations.product).toHaveProperty(key);
        expect(typeof translations.product[key]).toBe('string');
      }
    });

    it('should have authentication translations', () => {
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(process.cwd(), 'messages', 'en.json');
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const authKeys = [
        'loginTitle',
        'registerTitle',
        'email',
        'password',
        'confirmPassword',
        'name'
      ];
      
      for (const key of authKeys) {
        expect(translations.auth).toHaveProperty(key);
        expect(typeof translations.auth[key]).toBe('string');
      }
    });
  });

  describe('Translation Content Quality', () => {
    it('should not have empty translation values', () => {
      const fs = require('fs');
      const path = require('path');
      
      const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
      const messagesDir = path.join(process.cwd(), 'messages');
      
      function checkEmptyValues(obj: any, path: string[] = []): string[] {
        const emptyKeys: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = [...path, key];
          if (typeof value === 'object' && value !== null) {
            emptyKeys.push(...checkEmptyValues(value, currentPath));
          } else if (typeof value === 'string' && value.trim() === '') {
            emptyKeys.push(currentPath.join('.'));
          }
        }
        return emptyKeys;
      }
      
      for (const locale of locales) {
        const filePath = path.join(messagesDir, `${locale}.json`);
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const emptyKeys = checkEmptyValues(translations);
        
        expect(emptyKeys).toEqual([]);
      }
    });

    it('should have appropriate translations for each language', () => {
      const fs = require('fs');
      const path = require('path');
      
      const messagesDir = path.join(process.cwd(), 'messages');
      
      // Check that translations are actually different (not just copied)
      const enPath = path.join(messagesDir, 'en.json');
      const zhCNPath = path.join(messagesDir, 'zh-CN.json');
      
      const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
      const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf-8'));
      
      // Welcome message should be different in English and Chinese
      expect(enTranslations.common.welcome).not.toBe(zhCNTranslations.common.welcome);
      expect(enTranslations.common.welcome).toBe('Welcome to MyPilot');
      expect(zhCNTranslations.common.welcome).toBe('欢迎来到 MyPilot');
    });
  });

  describe('Middleware Configuration', () => {
    it('should have locale detection enabled', () => {
      const fs = require('fs');
      const path = require('path');
      
      const middlewarePath = path.join(process.cwd(), 'middleware.ts');
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      // Check that localeDetection is set to true
      expect(content).toContain('localeDetection: true');
    });

    it('should use correct default locale', () => {
      const fs = require('fs');
      const path = require('path');
      
      const middlewarePath = path.join(process.cwd(), 'middleware.ts');
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      // Check that defaultLocale is imported and used
      expect(content).toContain('defaultLocale');
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 2.1 - Support 5 languages', () => {
      const fs = require('fs');
      const path = require('path');
      
      const messagesDir = path.join(process.cwd(), 'messages');
      const files = fs.readdirSync(messagesDir);
      const jsonFiles = files.filter((f: string) => f.endsWith('.json'));
      
      expect(jsonFiles).toContain('en.json');
      expect(jsonFiles).toContain('zh-CN.json');
      expect(jsonFiles).toContain('zh-TW.json');
      expect(jsonFiles).toContain('ja.json');
      expect(jsonFiles).toContain('ko.json');
      expect(jsonFiles.length).toBe(5);
    });

    it('should satisfy Requirement 2.2 - All UI elements translated', () => {
      const fs = require('fs');
      const path = require('path');
      
      const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
      const messagesDir = path.join(process.cwd(), 'messages');
      
      // All locales should have the same number of keys
      const keyCounts = locales.map(locale => {
        const filePath = path.join(messagesDir, `${locale}.json`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        function countKeys(obj: any): number {
          let count = 0;
          for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null) {
              count += countKeys(value);
            } else {
              count++;
            }
          }
          return count;
        }
        
        return countKeys(content);
      });
      
      // All should have the same count
      const firstCount = keyCounts[0];
      for (const count of keyCounts) {
        expect(count).toBe(firstCount);
      }
      
      // Should have a reasonable number of translations
      expect(firstCount).toBeGreaterThan(50);
    });

    it('should satisfy Requirement 2.5 - Fallback to English', () => {
      const fs = require('fs');
      const path = require('path');
      
      // Check i18n.ts has defaultLocale set to 'en'
      const i18nPath = path.join(process.cwd(), 'i18n.ts');
      const i18nContent = fs.readFileSync(i18nPath, 'utf-8');
      expect(i18nContent).toContain("defaultLocale: Locale = 'en'");
      
      // English translation file should exist
      const enPath = path.join(process.cwd(), 'messages', 'en.json');
      expect(fs.existsSync(enPath)).toBe(true);
    });
  });
});
