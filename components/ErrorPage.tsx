'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ErrorPageProps {
  title?: string;
  description?: string;
  showTryAgain?: boolean;
  onTryAgain?: () => void;
  errorCode?: string | number;
}

export default function ErrorPage({
  title,
  description,
  showTryAgain = false,
  onTryAgain,
  errorCode,
}: ErrorPageProps) {
  const t = useTranslations('error.general');
  const params = useParams();
  const locale = params?.locale || 'en';

  const displayTitle = title || t('title');
  const displayDescription = description || t('description');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        {errorCode && (
          <div className="text-9xl font-bold text-gray-300 mb-4">
            {errorCode}
          </div>
        )}

        {/* Error Illustration */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="w-64 h-64 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {displayTitle}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {displayDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showTryAgain && onTryAgain && (
            <button
              onClick={onTryAgain}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t('tryAgain')}
            </button>
          )}

          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t('goHome')}
          </Link>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            Need help? Visit our{' '}
            <Link
              href={`/${locale}/help`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Help Center
            </Link>{' '}
            or{' '}
            <Link
              href={`/${locale}/contact`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Contact Support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
