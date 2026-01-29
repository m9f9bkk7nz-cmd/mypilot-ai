import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[slug] - 获取产品详情
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    
    const product = await prisma.product.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        translations: {
          where: {
            locale,
          },
        },
        reviews: {
          where: {
            approved: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 计算评分统计
    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    
    // 评分分布
    const ratingDistribution = {
      5: ratings.filter((r) => r === 5).length,
      4: ratings.filter((r) => r === 4).length,
      3: ratings.filter((r) => r === 3).length,
      2: ratings.filter((r) => r === 2).length,
      1: ratings.filter((r) => r === 1).length,
    };
    
    // 使用翻译
    const translation = product.translations[0];
    
    // 格式化评价
    const formattedReviews = product.reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name,
      userImage: review.user.image,
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      verified: review.verified,
      createdAt: review.createdAt,
    }));
    
    // 获取相关产品
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        published: true,
        id: {
          not: product.id,
        },
      },
      include: {
        translations: {
          where: {
            locale,
          },
        },
        reviews: {
          where: {
            approved: true,
          },
          select: {
            rating: true,
          },
        },
      },
      take: 4,
    });
    
    const formattedRelatedProducts = relatedProducts.map((p) => {
      const pRatings = p.reviews.map((r) => r.rating);
      const pAvgRating = pRatings.length > 0
        ? pRatings.reduce((a, b) => a + b, 0) / pRatings.length
        : 0;
      const pTranslation = p.translations[0];
      
      return {
        id: p.id,
        slug: p.slug,
        name: pTranslation?.name || p.name,
        price: Number(p.price),
        images: p.images,
        rating: Math.round(pAvgRating * 10) / 10,
        reviewCount: p.reviews.length,
        inStock: p.inventory > 0,
      };
    });
    
    return NextResponse.json({
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      name: translation?.name || product.name,
      description: translation?.description || product.description,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      images: product.images,
      inventory: product.inventory,
      inStock: product.inventory > 0,
      lowStockThreshold: product.lowStockThreshold,
      weight: product.weight ? Number(product.weight) : null,
      featured: product.featured,
      category: product.category,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      ratingDistribution,
      reviews: formattedReviews,
      relatedProducts: formattedRelatedProducts,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
