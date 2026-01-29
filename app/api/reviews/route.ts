import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/reviews - 获取产品评价列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, rating-high, rating-low
    const skip = (page - 1) * limit;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // 验证产品存在
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 构建排序条件
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating-high') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'rating-low') {
      orderBy = { rating: 'asc' };
    }
    
    // 获取评价列表（仅显示已批准的）
    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          productId,
          approved: true,
        },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          productId,
          approved: true,
        },
        _count: {
          rating: true,
        },
      }),
    ]);
    
    // 计算评分统计
    const totalReviews = stats.reduce((sum, stat) => sum + stat._count.rating, 0);
    const averageRating = totalReviews > 0
      ? stats.reduce((sum, stat) => sum + stat.rating * stat._count.rating, 0) / totalReviews
      : 0;
    
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    
    stats.forEach((stat) => {
      ratingDistribution[stat.rating as keyof typeof ratingDistribution] = stat._count.rating;
    });
    
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name || 'Anonymous',
      userImage: review.user.image,
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      verified: review.verified,
      createdAt: review.createdAt,
    }));
    
    return NextResponse.json({
      reviews: formattedReviews,
      stats: {
        total: totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        distribution: ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - 创建评价
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { productId, rating, comment, images = [] } = body;
    
    // 验证输入
    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // 验证产品存在
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 检查用户是否已经评价过该产品
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 422 }
      );
    }
    
    // 验证用户是否购买过该产品
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
    });
    
    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 422 }
      );
    }
    
    // 创建评价
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment: comment || null,
        images: images || [],
        verified: true, // 已验证购买
        approved: true, // 自动批准（可以改为需要管理员审核）
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
    });
    
    return NextResponse.json({
      review: {
        id: review.id,
        userId: review.userId,
        userName: review.user.name,
        userImage: review.user.image,
        productId: review.productId,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        verified: review.verified,
        approved: review.approved,
        createdAt: review.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
