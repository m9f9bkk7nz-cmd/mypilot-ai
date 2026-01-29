import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    const includeTree = searchParams.get('tree') === 'true';
    
    if (includeTree) {
      // 获取分类树结构（仅顶级分类及其子分类）
      const categories = await prisma.category.findMany({
        where: {
          parentId: null,
        },
        include: {
          translations: {
            where: {
              locale,
            },
          },
          children: {
            include: {
              translations: {
                where: {
                  locale,
                },
              },
              _count: {
                select: {
                  products: {
                    where: {
                      published: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              products: {
                where: {
                  published: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      
      // 格式化分类树
      const formattedCategories = categories.map((category) => {
        const translation = category.translations[0];
        
        return {
          id: category.id,
          slug: category.slug,
          name: translation?.name || category.name,
          description: translation?.description || category.description,
          image: category.image,
          productCount: category._count.products,
          children: category.children.map((child) => {
            const childTranslation = child.translations[0];
            return {
              id: child.id,
              slug: child.slug,
              name: childTranslation?.name || child.name,
              description: childTranslation?.description || child.description,
              image: child.image,
              productCount: child._count.products,
            };
          }),
        };
      });
      
      return NextResponse.json({
        categories: formattedCategories,
      });
    } else {
      // 获取所有分类（扁平列表）
      const categories = await prisma.category.findMany({
        include: {
          translations: {
            where: {
              locale,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              products: {
                where: {
                  published: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      
      const formattedCategories = categories.map((category) => {
        const translation = category.translations[0];
        
        return {
          id: category.id,
          slug: category.slug,
          name: translation?.name || category.name,
          description: translation?.description || category.description,
          image: category.image,
          parentId: category.parentId,
          parent: category.parent,
          productCount: category._count.products,
        };
      });
      
      return NextResponse.json({
        categories: formattedCategories,
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
