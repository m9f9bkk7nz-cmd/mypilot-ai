/**
 * SEO 工具函数
 * 生成 Meta 标签、Open Graph、Twitter Card 等
 */

import { config } from './config';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * 生成页面标题
 */
export function generateTitle(title: string, includeAppName = true): string {
  if (includeAppName) {
    return `${title} | ${config.app.name}`;
  }
  return title;
}

/**
 * 生成 Meta 标签
 */
export function generateMetadata(seoConfig: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    image = `${config.app.url}/og-image.jpg`,
    url = config.app.url,
    type = 'website',
    locale = 'en',
    author,
    publishedTime,
    modifiedTime,
    noindex = false,
    nofollow = false,
  } = seoConfig;

  const fullTitle = generateTitle(title);
  const fullUrl = url.startsWith('http') ? url : `${config.app.url}${url}`;

  const metadata: any = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: config.app.name,
    publisher: config.app.name,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'en': `${config.app.url}/en`,
        'zh-CN': `${config.app.url}/zh-CN`,
        'zh-TW': `${config.app.url}/zh-TW`,
        'ja': `${config.app.url}/ja`,
        'ko': `${config.app.url}/ko`,
      },
    },
    openGraph: {
      type,
      locale,
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: config.app.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@mypilot',
      site: '@mypilot',
    },
  };

  return metadata;
}

/**
 * 生成产品结构化数据 (JSON-LD)
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: config.app.url,
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}

/**
 * 生成面包屑结构化数据 (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.app.url}${item.url}`,
    })),
  };
}

/**
 * 生成组织结构化数据 (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.app.name,
    url: config.app.url,
    logo: `${config.app.url}/logo.png`,
    sameAs: [
      'https://twitter.com/mypilot',
      'https://facebook.com/mypilot',
      'https://instagram.com/mypilot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@mypilot.com',
      availableLanguage: ['English', 'Chinese', 'Japanese', 'Korean'],
    },
  };
}

/**
 * 生成网站结构化数据 (JSON-LD)
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.app.name,
    url: config.app.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.app.url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成评价结构化数据 (JSON-LD)
 */
export function generateReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed: {
    name: string;
    type: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
  };
}

/**
 * 渲染 JSON-LD 脚本标签
 */
export function renderJsonLd(data: any) {
  return {
    __html: JSON.stringify(data),
  };
}
