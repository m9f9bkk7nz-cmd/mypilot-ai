import { MetadataRoute } from 'next';
import { config } from '@/lib/config';
import { prisma } from '@/lib/prisma';

/**
 * 生成 Sitemap
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.app.url;

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // 动态产品页面
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/en/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 动态分类页面
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
      },
    });

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/en/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // 如果数据库查询失败，至少返回静态页面
    return staticPages;
  }
}
