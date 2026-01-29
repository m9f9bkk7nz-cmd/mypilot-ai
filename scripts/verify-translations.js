/**
 * Translation File Verification Script
 * 
 * This script verifies that all translation files have consistent keys
 * and reports any missing or extra keys across languages.
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const LOCALES = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
const DEFAULT_LOCALE = 'en';

/**
 * Recursively get all keys from a translation object
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
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

/**
 * Load translation file for a locale
 */
function loadTranslations(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Main verification function
 */
function verifyTranslations() {
  console.log('🔍 Verifying translation files...\n');
  
  // Load all translations
  const translations = {};
  const allKeys = {};
  
  for (const locale of LOCALES) {
    try {
      translations[locale] = loadTranslations(locale);
      allKeys[locale] = getAllKeys(translations[locale]);
      console.log(`✅ Loaded ${locale}: ${allKeys[locale].length} keys`);
    } catch (error) {
      console.error(`❌ Failed to load ${locale}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n📊 Verification Results:\n');
  
  // Use default locale as reference
  const referenceKeys = allKeys[DEFAULT_LOCALE];
  let hasErrors = false;
  
  // Check each locale against the reference
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    
    const localeKeys = allKeys[locale];
    const missingKeys = referenceKeys.filter(key => !localeKeys.includes(key));
    const extraKeys = localeKeys.filter(key => !referenceKeys.includes(key));
    
    if (missingKeys.length > 0 || extraKeys.length > 0) {
      hasErrors = true;
      console.log(`⚠️  ${locale}:`);
      
      if (missingKeys.length > 0) {
        console.log(`   Missing keys (${missingKeys.length}):`);
        missingKeys.forEach(key => console.log(`     - ${key}`));
      }
      
      if (extraKeys.length > 0) {
        console.log(`   Extra keys (${extraKeys.length}):`);
        extraKeys.forEach(key => console.log(`     + ${key}`));
      }
      
      console.log('');
    } else {
      console.log(`✅ ${locale}: All keys match (${localeKeys.length} keys)`);
    }
  }
  
  if (!hasErrors) {
    console.log('\n✨ All translation files are consistent!\n');
    console.log('📋 Translation Coverage:');
    console.log(`   - Total keys: ${referenceKeys.length}`);
    console.log(`   - Languages: ${LOCALES.length}`);
    console.log(`   - Default locale: ${DEFAULT_LOCALE}`);
    console.log(`   - Fallback mechanism: Configured in i18n.ts\n`);
  } else {
    console.log('\n❌ Translation files have inconsistencies. Please fix the issues above.\n');
    process.exit(1);
  }
}

// Run verification
verifyTranslations();
