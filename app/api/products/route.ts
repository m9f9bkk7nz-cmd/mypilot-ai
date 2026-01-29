import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache } from '@/lib/cache';
import { 
  parsePagination, 
  paginationMeta, 
  sanitizeSearchInput,
  errorResponse 
} from '@/lib/api-utils';

// GET /api/products - 获取产品列表（支持分页、筛选、排序、缓存）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 分页参数
    const { page, limit, skip } = parsePagination({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      maxLimit: 50,
    });
    
    // 筛选参数
    const category = searchParams.get('category');
    const search = sanitizeSearchInput(searchParams.get('search'));
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    
    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 语言参数
    const locale = searchParams.get('locale') || 'en';
    
    // 生成缓存键（仅对无搜索的请求缓存）
    const cacheKey = !search 
      ? `products:${page}:${limit}:${category || 'all'}:${sortBy}:${sortOrder}:${locale}:${featured || 'all'}`
      : null;
    
    // 尝试从缓存获取
    if (cacheKey) {
      const cached = await getCache<{ products: unknown[]; pagination: unknown }>(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }
    
    // 构建查询条件
    const where: Record<string, unknown> = {
      published: true,
    };
    
    if (category) {
      where.categoryId = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }
    
    if (inStock === 'true') {
      where.inventory = { gt: 0 };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    // 构建排序
    const validSortFields = ['price', 'name', 'createdAt'];
    const orderBy = {
      [validSortFields.includes(sortBy) ? sortBy : 'createdAt']: sortOrder === 'asc' ? 'asc' : 'desc',
    };
    
    // 查询产品（使用 _count 优化评论计数）
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          translations: {
            where: { locale },
            take: 1,
          },
          _count: {
            select: {
              reviews: {
                where: { approved: true },
              },
            },
          },
          reviews: {
            where: { approved: true },
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    
    // 处理产品数据
    const productsWithRatings = products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
      
      const translation = product.translations[0];
      
      return {
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
        featured: product.featured,
        category: product.category,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        createdAt: product.createdAt,
      };
    });
    
    const response = {
      products: productsWithRatings,
      pagination: paginationMeta(page, limit, total),
    };
    
    // 缓存结果（5分钟）
    if (cacheKey) {
      await setCache(cacheKey, response, { ttl: 300 });
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch products',
      status: 500,
    });
  }
}
