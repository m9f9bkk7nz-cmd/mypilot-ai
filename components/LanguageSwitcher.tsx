'use client';

import { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en-AU', name: 'English (AU)', flag: '🇦🇺' },
];

export default function LanguageSwitcher() {
  const [showModal, setShowModal] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('zh-CN');
  const [mounted, setMounted] = useState(false);

  // 客户端获取当前语言
  useEffect(() => {
    setMounted(true);
    const path = window.location.pathname;
    for (const lang of languages) {
      if (path.startsWith(`/${lang.code}/`) || path === `/${lang.code}`) {
        setCurrentLocale(lang.code);
        return;
      }
    }
    setCurrentLocale('en');
  }, []);

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

  // 切换语言
  const switchLanguage = (newLocale: string) => {
    const path = window.location.pathname;
    
    // 移除当前语言前缀，按代码长度降序排列以避免误匹配
    // 例如 'en-AU' 应该在 'en' 之前检查
    const sortedLanguages = [...languages].sort((a, b) => b.code.length - a.code.length);
    
    let newPath = path;
    for (const lang of sortedLanguages) {
      if (path.startsWith(`/${lang.code}/`)) {
        newPath = path.substring(lang.code.length + 1); // +1 for the leading slash
        break;
      } else if (path === `/${lang.code}`) {
        newPath = '/';
        break;
      }
    }
    
    // 确保 newPath 以 / 开头
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }
    
    // 添加新语言前缀
    const targetUrl = newPath === '/' ? `/${newLocale}` : `/${newLocale}${newPath}`;
    
    console.log('Switching language:', { from: currentLocale, to: newLocale, path, newPath, targetUrl });
    window.location.href = targetUrl;
  };

  // 避免服务端渲染不匹配
  if (!mounted) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600">
        <span className="text-lg">🌐</span>
        <span className="text-sm text-gray-300 hidden sm:inline">语言</span>
      </button>
    );
  }

  return (
    <>
      {/* 语言切换按钮 - 显示当前语言 */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-cyan-400 transition-all"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm text-gray-300">{currentLang.name}</span>
      </button>

      {/* 语言选择弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl border border-cyan-500/30 p-6 w-full max-w-sm mx-4 shadow-2xl">
            {/* 标题 */}
            <div className="text-center mb-6">
              <GlobeAltIcon className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">选择语言</h2>
              <p className="text-gray-400 text-sm">Select Language</p>
            </div>

            {/* 语言列表 */}
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setShowModal(false);
                    if (lang.code !== currentLocale) {
                      switchLanguage(lang.code);
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    lang.code === currentLocale
                      ? 'bg-cyan-500/20 border-2 border-cyan-400'
                      : 'bg-gray-800 border-2 border-transparent hover:border-cyan-400/50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`font-medium ${lang.code === currentLocale ? 'text-cyan-400' : 'text-white'}`}>
                    {lang.name}
                  </span>
                  {lang.code === currentLocale && (
                    <span className="ml-auto text-cyan-400">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 text-gray-400 hover:text-white transition-colors"
            >
              关闭 / Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
