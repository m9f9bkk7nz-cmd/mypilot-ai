import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: `${t('welcome')} - MyPilot`,
    description: t('description'),
  };
}

export default function TestI18nPage() {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tProduct = useTranslations('product');
  const tCart = useTranslations('cart');
  const tAuth = useTranslations('auth');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Language Switcher */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tCommon('welcome')}
            </h1>
            <LanguageSwitcher />
          </div>
          <p className="mt-2 text-gray-600">{tCommon('description')}</p>
        </div>

        {/* Common Translations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Common Translations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Login:</span> {tCommon('login')}
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Register:</span>{' '}
              {tCommon('register')}
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Cart:</span> {tCommon('cart')}
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Search:</span> {tCommon('search')}
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Loading:</span> {tCommon('loading')}
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <span className="font-medium">Submit:</span> {tCommon('submit')}
            </div>
          </div>
        </div>

        {/* Navigation Translations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Navigation Translations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 rounded">
              <span className="font-medium">Home:</span> {tNav('home')}
            </div>
            <div className="p-3 bg-green-50 rounded">
              <span className="font-medium">Products:</span> {tNav('products')}
            </div>
            <div className="p-3 bg-green-50 rounded">
              <span className="font-medium">Orders:</span> {tNav('orders')}
            </div>
            <div className="p-3 bg-green-50 rounded">
              <span className="font-medium">Settings:</span> {tNav('settings')}
            </div>
          </div>
        </div>

        {/* Product Translations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Product Translations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">Add to Cart:</span>{' '}
              {tProduct('addToCart')}
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">In Stock:</span>{' '}
              {tProduct('inStock')}
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">Out of Stock:</span>{' '}
              {tProduct('outOfStock')}
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">Price:</span> {tProduct('price')}
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">Reviews:</span> {tProduct('reviews')}
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <span className="font-medium">Rating:</span> {tProduct('rating')}
            </div>
          </div>
        </div>

        {/* Cart Translations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Cart Translations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-yellow-50 rounded">
              <span className="font-medium">Title:</span> {tCart('title')}
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <span className="font-medium">Empty:</span> {tCart('empty')}
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <span className="font-medium">Checkout:</span> {tCart('checkout')}
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <span className="font-medium">Total:</span> {tCart('total')}
            </div>
          </div>
        </div>

        {/* Auth Translations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Authentication Translations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded">
              <span className="font-medium">Login Title:</span>{' '}
              {tAuth('loginTitle')}
            </div>
            <div className="p-3 bg-red-50 rounded">
              <span className="font-medium">Register Title:</span>{' '}
              {tAuth('registerTitle')}
            </div>
            <div className="p-3 bg-red-50 rounded">
              <span className="font-medium">Email:</span> {tAuth('email')}
            </div>
            <div className="p-3 bg-red-50 rounded">
              <span className="font-medium">Password:</span> {tAuth('password')}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            Testing Instructions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Use the language switcher above to change languages</li>
            <li>All text should update immediately</li>
            <li>
              Supported languages: English, 简体中文, 繁體中文, 日本語, 한국어
            </li>
            <li>Language preference is saved in a cookie</li>
            <li>Try navigating to different URLs with locale prefixes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
