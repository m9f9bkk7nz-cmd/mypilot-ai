import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  
  return {
    title: t('returns.title'),
    description: t('returns.description'),
  };
}

export default function ReturnsPage() {
  const t = useTranslations('legal.returns');

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
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('overview.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t('overview.content')}
            </p>
          </section>

          {/* Return Period */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('period.title')}
            </h2>
            <div className="p-6 glass rounded-xl">
              <p className="text-xl text-white font-semibold mb-2">
                {t('period.days')}
              </p>
              <p className="text-gray-300">
                {t('period.content')}
              </p>
            </div>
          </section>

          {/* Eligible Items */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('eligible.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-green-400 mb-2">
                  ✓ {t('eligible.accepted.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('eligible.accepted.unused')}</li>
                  <li>{t('eligible.accepted.packaging')}</li>
                  <li>{t('eligible.accepted.accessories')}</li>
                  <li>{t('eligible.accepted.receipt')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-red-400 mb-2">
                  ✗ {t('eligible.notAccepted.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('eligible.notAccepted.opened')}</li>
                  <li>{t('eligible.notAccepted.damaged')}</li>
                  <li>{t('eligible.notAccepted.custom')}</li>
                  <li>{t('eligible.notAccepted.sale')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('process.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {t('process.step1.title')}
                  </h3>
                  <p className="text-gray-300">
                    {t('process.step1.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {t('process.step2.title')}
                  </h3>
                  <p className="text-gray-300">
                    {t('process.step2.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {t('process.step3.title')}
                  </h3>
                  <p className="text-gray-300">
                    {t('process.step3.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {t('process.step4.title')}
                  </h3>
                  <p className="text-gray-300">
                    {t('process.step4.content')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('refund.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('refund.content')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t('refund.method')}</li>
              <li>{t('refund.time')}</li>
              <li>{t('refund.shipping')}</li>
            </ul>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('exchanges.title')}
            </h2>
            <p className="text-gray-300">
              {t('exchanges.content')}
            </p>
          </section>

          {/* Damaged Items */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('damaged.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('damaged.content')}
            </p>
            <div className="p-4 glass rounded-lg border-l-4 border-red-500">
              <p className="text-white font-semibold mb-2">
                {t('damaged.important')}
              </p>
              <p className="text-gray-300">
                {t('damaged.report')}
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('contact.title')}
            </h2>
            <div className="p-6 glass rounded-xl">
              <p className="text-white mb-4">
                {t('contact.content')}
              </p>
              <div className="space-y-2">
                <p className="text-white">Email: returns@mypilot.com</p>
                <p className="text-white">Phone: +1 (555) 123-4567</p>
                <p className="text-white">Hours: Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
