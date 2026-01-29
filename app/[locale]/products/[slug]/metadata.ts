import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { generateMetadata as generateSEOMetadata, generateProductSchema, generateBreadcrumbSchema, renderJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

/**
 * 生成产品页面的 Metadata
 */
export async function generateProductMetadata(slug: string, locale: string): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!product) {
      return {};
    }

    // 计算平均评分
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return generateSEOMetadata({
      title: product.name,
      description: product.description.substring(0, 160),
      keywords: [
        product.name,
        product.category?.name || '',
        'buy online',
        'ecommerce',
        'MyPilot',
      ],
      image: product.images[0] || undefined,
      url: `/products/${product.slug}`,
      type: 'product',
      locale,
    });
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {};
  }
}

/**
 * 生成产品结构化数据
 */
export async function generateProductStructuredData(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // 计算平均评分
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : undefined;

    const productSchema = generateProductSchema({
      name: product.name,
      description: product.description,
      image: product.images[0] || '',
      price: Number(product.price),
      currency: 'USD',
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      brand: 'MyPilot',
      sku: product.sku || product.id,
      rating: avgRating,
      reviewCount: product.reviews.length,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.category?.name || 'Category', url: `/categories/${product.category?.slug}` },
      { name: product.name, url: `/products/${product.slug}` },
    ]);

    return { productSchema, breadcrumbSchema };
  } catch (error) {
    console.error('Error generating product structured data:', error);
    return null;
  }
}
