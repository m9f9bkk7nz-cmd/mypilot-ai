import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  
  return {
    title: t('terms.title'),
    description: t('terms.description'),
  };
}

export default function TermsOfServicePage() {
  const t = useTranslations('legal.terms');

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-400">
            {t('lastUpdated')}: 2026-01-29
          </p>
        </div>

        {/* Content */}
        <div className="glass-strong rounded-2xl p-8 space-y-8">
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('acceptance.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t('acceptance.content')}
            </p>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('account.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('account.registration')}</li>
              <li>{t('account.accuracy')}</li>
              <li>{t('account.security')}</li>
              <li>{t('account.responsibility')}</li>
            </ul>
          </section>

          {/* Products */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('products.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('products.content')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('products.availability')}</li>
              <li>{t('products.pricing')}</li>
              <li>{t('products.description')}</li>
            </ul>
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('orders.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('orders.placement')}</li>
              <li>{t('orders.acceptance')}</li>
              <li>{t('orders.cancellation')}</li>
              <li>{t('orders.modification')}</li>
            </ul>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('payment.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('payment.content')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('payment.methods')}</li>
              <li>{t('payment.security')}</li>
              <li>{t('payment.authorization')}</li>
            </ul>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('shipping.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('shipping.methods')}</li>
              <li>{t('shipping.time')}</li>
              <li>{t('shipping.risk')}</li>
              <li>{t('shipping.international')}</li>
            </ul>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('returns.title')}
            </h2>
            <p className="text-gray-300">
              {t('returns.content')}
            </p>
          </section>

          {/* Warranty */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('warranty.title')}
            </h2>
            <p className="text-gray-300">
              {t('warranty.content')}
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('liability.title')}
            </h2>
            <p className="text-gray-300">
              {t('liability.content')}
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('intellectual.title')}
            </h2>
            <p className="text-gray-300">
              {t('intellectual.content')}
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('termination.title')}
            </h2>
            <p className="text-gray-300">
              {t('termination.content')}
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('changes.title')}
            </h2>
            <p className="text-gray-300">
              {t('changes.content')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('contact.title')}
            </h2>
            <div className="p-4 glass rounded-lg">
              <p className="text-white">Email: legal@mypilot.com</p>
              <p className="text-white">Address: [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
