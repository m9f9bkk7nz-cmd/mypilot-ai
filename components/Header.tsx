'use client';

import { useState, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  locale: string;
  cartItemCount?: number;
  isAuthenticated?: boolean;
}

function Header({ locale, cartItemCount = 0, isAuthenticated = false }: HeaderProps) {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery, locale]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    setIsUserMenuOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="glass-holo sticky top-0 z-50 border-b border-neon-blue/30 shadow-lg shadow-neon-blue/20 backdrop-blur-xl">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"></div>
      
      <div className="container mx-auto px-4">
        {/* Top Bar - Desktop */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-neon-blue/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-lg shadow-neon-cyan/50"></span>
              <span className="text-gray-400 text-xs tracking-wider uppercase">{t('common.welcome')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group relative">
            {/* Logo Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 border border-neon-cyan/50 rounded-lg group-hover:border-neon-cyan transition-colors"></div>
              <span className="text-xl font-bold text-neon-cyan relative z-10">M</span>
            </div>
            {/* Logo Text */}
            <div className="relative">
              <span className="text-2xl font-bold gradient-text-neon tracking-tight">MyPilot</span>
              <span className="absolute -bottom-1 left-0 text-[8px] text-neon-cyan/60 tracking-[0.3em] uppercase">Autonomous</span>
            </div>
            <div className="absolute -inset-4 bg-neon-cyan/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: `/${locale}`, label: t('nav.home') },
              { href: `/${locale}/products`, label: t('nav.products') },
              { href: `/${locale}/vehicles`, label: t('nav.vehicles') },
              { href: `/${locale}/about`, label: t('nav.about') },
              { href: `/${locale}/contact`, label: t('nav.contact') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10">{item.label}</span>
                {/* Hover background */}
                <span className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/10 to-neon-blue/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></span>
                {/* Bottom line */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink group-hover:w-3/4 transition-all duration-300 shadow-lg shadow-neon-cyan/50"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full px-4 py-2.5 pl-11 pr-4 bg-black/40 border border-neon-blue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan text-white placeholder-gray-500 transition-all duration-300 text-sm"
                  aria-label={t('common.search')}
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                {/* Search glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2.5 text-gray-400 hover:text-neon-cyan transition-colors rounded-lg hover:bg-neon-cyan/10"
              aria-label={t('common.search')}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Shopping Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2.5 text-gray-400 hover:text-neon-cyan transition-all duration-300 group rounded-lg hover:bg-neon-cyan/10"
              aria-label={t('common.cart')}
            >
              <ShoppingCartIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-neon-pink/50 animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="p-2.5 text-gray-400 hover:text-neon-cyan transition-all duration-300 group rounded-lg hover:bg-neon-cyan/10"
                aria-label={t('common.account')}
              >
                <UserIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-strong rounded-xl shadow-2xl shadow-neon-blue/30 py-2 border border-neon-blue/30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {/* Menu header glow */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
                  
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={`/${locale}/account`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50"></span>
                        {t('nav.myAccount')}
                      </Link>
                      <Link
                        href={`/${locale}/account/orders`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple/50"></span>
                        {t('nav.orders')}
                      </Link>
                      <Link
                        href={`/${locale}/account/addresses`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-pink/50"></span>
                        {t('nav.addresses')}
                      </Link>
                      <hr className="my-2 border-neon-blue/20" />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          window.location.href = `/api/auth/signout`;
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-300 hover:text-neon-pink hover:bg-neon-pink/10 transition-all duration-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
                        {t('common.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/${locale}/auth/login`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                        {t('common.login')}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-neon-purple hover:bg-neon-purple/10 transition-all duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span>
                        {t('common.register')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2.5 text-gray-400 hover:text-neon-cyan transition-colors rounded-lg hover:bg-neon-cyan/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full px-4 py-3 pl-11 pr-4 bg-black/40 border border-neon-blue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan text-white placeholder-gray-500 transition-all duration-300"
                  aria-label={t('common.search')}
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neon-blue/20 py-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col space-y-1">
              {[
                { href: `/${locale}`, label: t('nav.home'), color: 'neon-cyan' },
                { href: `/${locale}/products`, label: t('nav.products'), color: 'neon-purple' },
                { href: `/${locale}/vehicles`, label: t('nav.vehicles'), color: 'neon-pink' },
                { href: `/${locale}/about`, label: t('nav.about'), color: 'neon-cyan' },
                { href: `/${locale}/contact`, label: t('nav.contact'), color: 'neon-purple' },
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neon-blue/10 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}/50`}></span>
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language */}
              <div className="pt-4 mt-4 border-t border-neon-blue/20">
                <div className="px-4 mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{t('common.language')}</span>
                </div>
                <div className="px-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
