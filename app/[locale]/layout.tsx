import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, generateWebsiteSchema, renderJsonLd } from '@/lib/seo';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成 Metadata
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages();
  
  return generateSEOMetadata({
    title: 'Home',
    description: 'MyPilot - Your premier online shopping destination for quality products. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.',
    keywords: ['ecommerce', 'online shopping', 'electronics', 'fashion', 'home goods', 'MyPilot'],
    locale,
    type: 'website',
  });
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // 生成结构化数据
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang={locale}>
      <head>
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(organizationSchema)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(websiteSchema)}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} cartItemCount={0} isAuthenticated={false} />
          {children}
          <Footer locale={locale} />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
