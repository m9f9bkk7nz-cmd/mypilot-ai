'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// Category type definition
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  children?: Category[];
}

interface NavigationProps {
  categories?: Category[];
}

export default function Navigation({ categories = [] }: NavigationProps) {
  const t = useTranslations('nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryId(openCategoryId === categoryId ? null : categoryId);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MyPilot
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('home')}
              </Link>
              
              {/* Products with Dropdown */}
              <div className="relative group">
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  {t('products')}
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                
                {/* Desktop Dropdown Menu */}
                {categories.length > 0 && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {categories.map((category) => (
                        <div key={category.id}>
                          <Link
                            href={`/products?category=${category.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {category.name}
                          </Link>
                          
                          {/* Sub-categories */}
                          {category.children && category.children.length > 0 && (
                            <div className="pl-4">
                              {category.children.map((subCategory) => (
                                <Link
                                  key={subCategory.id}
                                  href={`/products?category=${subCategory.slug}`}
                                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                  {subCategory.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('about')}
              </Link>
              
              <Link
                href="/vehicles"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('vehicles') || '支持车型'}
              </Link>
              
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('contact')}
              </Link>
            </div>
          </div>

          {/* Right Side - Language Switcher and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('products')}
            </Link>
            
            {/* Mobile Categories */}
            {categories.length > 0 && (
              <div className="pl-4 space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="flex-1 block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      
                      {/* Toggle button for sub-categories */}
                      {category.children && category.children.length > 0 && (
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-900"
                          aria-label={`Toggle ${category.name} subcategories`}
                        >
                          <svg
                            className={`h-4 w-4 transform transition-transform ${
                              openCategoryId === category.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Sub-categories */}
                    {category.children &&
                      category.children.length > 0 &&
                      openCategoryId === category.id && (
                        <div className="pl-4 space-y-1">
                          {category.children.map((subCategory) => (
                            <Link
                              key={subCategory.id}
                              href={`/products?category=${subCategory.slug}`}
                              className="block px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subCategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
            
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
            
            <Link
              href="/vehicles"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('vehicles') || '支持车型'}
            </Link>
            
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
