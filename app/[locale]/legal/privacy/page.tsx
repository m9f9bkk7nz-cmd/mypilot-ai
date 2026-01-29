import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
  };
}

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal.privacy');

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
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('introduction.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t('introduction.content')}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('collection.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {t('collection.personal.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('collection.personal.name')}</li>
                  <li>{t('collection.personal.email')}</li>
                  <li>{t('collection.personal.address')}</li>
                  <li>{t('collection.personal.phone')}</li>
                  <li>{t('collection.personal.payment')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {t('collection.usage.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('collection.usage.browsing')}</li>
                  <li>{t('collection.usage.device')}</li>
                  <li>{t('collection.usage.location')}</li>
                  <li>{t('collection.usage.cookies')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('usage.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('usage.processOrders')}</li>
              <li>{t('usage.communication')}</li>
              <li>{t('usage.improvement')}</li>
              <li>{t('usage.security')}</li>
              <li>{t('usage.legal')}</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('sharing.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('sharing.intro')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('sharing.serviceProviders')}</li>
              <li>{t('sharing.payment')}</li>
              <li>{t('sharing.shipping')}</li>
              <li>{t('sharing.legal')}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('security.title')}
            </h2>
            <p className="text-gray-300">
              {t('security.content')}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('rights.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('rights.access')}</li>
              <li>{t('rights.correction')}</li>
              <li>{t('rights.deletion')}</li>
              <li>{t('rights.portability')}</li>
              <li>{t('rights.objection')}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('cookies.title')}
            </h2>
            <p className="text-gray-300">
              {t('cookies.content')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-gray-300">
              {t('contact.content')}
            </p>
            <div className="mt-4 p-4 glass rounded-lg">
              <p className="text-white">Email: privacy@mypilot.com</p>
              <p className="text-white">Address: [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
