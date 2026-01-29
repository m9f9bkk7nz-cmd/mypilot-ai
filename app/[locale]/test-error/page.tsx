'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ErrorPage from '@/components/ErrorPage';

export default function TestErrorPage() {
  const [errorType, setErrorType] = useState<'none' | 'runtime' | 'custom'>('none');
  const t = useTranslations('common');
  const params = useParams();
  const locale = params?.locale || 'en';

  // Trigger runtime error for testing error boundary
  if (errorType === 'runtime') {
    throw new Error('This is a test runtime error to demonstrate the error boundary');
  }

  // Show custom error page
  if (errorType === 'custom') {
    return (
      <ErrorPage
        title="Custom Error Example"
        description="This is a demonstration of the custom error page component"
        errorCode="TEST"
        showTryAgain={true}
        onTryAgain={() => setErrorType('none')}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Error Pages Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Error Pages</h2>
          <p className="text-gray-600 mb-6">
            Click the buttons below to test different error scenarios:
          </p>

          <div className="space-y-4">
            {/* Test 404 */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">404 Not Found</h3>
              <p className="text-gray-600 mb-4">
                Navigate to a non-existent page to see the 404 error page.
              </p>
              <Link
                href={`/${locale}/this-page-does-not-exist`}
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test 404 Page
              </Link>
            </div>

            {/* Test Runtime Error (500) */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">500 Server Error</h3>
              <p className="text-gray-600 mb-4">
                Trigger a runtime error to see the error boundary in action.
              </p>
              <button
                onClick={() => setErrorType('runtime')}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Trigger Runtime Error
              </button>
            </div>

            {/* Test Custom Error */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Custom Error Page</h3>
              <p className="text-gray-600 mb-4">
                Display a custom error page using the ErrorPage component.
              </p>
              <button
                onClick={() => setErrorType('custom')}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Show Custom Error
              </button>
            </div>
          </div>
        </div>

        {/* Language Testing */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Test Translations</h2>
          <p className="text-gray-600 mb-6">
            Test error pages in different languages:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              href="/en/this-page-does-not-exist"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              English
            </Link>
            <Link
              href="/zh-CN/this-page-does-not-exist"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              简体中文
            </Link>
            <Link
              href="/zh-TW/this-page-does-not-exist"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              繁體中文
            </Link>
            <Link
              href="/ja/this-page-does-not-exist"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              日本語
            </Link>
            <Link
              href="/ko/this-page-does-not-exist"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              한국어
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t('back')} to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
