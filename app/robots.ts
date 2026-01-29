import { MetadataRoute } from 'next';
import { config } from '@/lib/config';

/**
 * 生成 robots.txt
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/api/',
          '/test-*',
          '/navigation-demo',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/'],
      },
    ],
    sitemap: `${config.app.url}/sitemap.xml`,
  };
}
