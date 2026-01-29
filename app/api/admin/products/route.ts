import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { verifyAdminAccess, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  sku: z.string().min(1).max(100),
  description: z.string(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  inventory: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  images: z.array(z.string()).min(1),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string(),
});

// POST /api/admin/products - 创建产品（管理员）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const isAdmin = await verifyAdminAccess(session);
    if (!isAdmin) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Admin access required',
        status: 403,
      });
    }
    
    const body = await request.json();
    
    // 验证输入
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        status: 400,
        details: { errors: validation.error.errors },
      });
    }
    
    const productData = validation.data;
    
    // 检查 slug 和 sku 是否已存在
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: productData.slug },
          { sku: productData.sku },
        ],
      },
    });
    
    if (existing) {
      return errorResponse({
        code: 'DUPLICATE_ENTRY',
        message: 'Product with this slug or SKU already exists',
        status: 422,
      });
    }
    
    // 验证分类存在
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });
    
    if (!category) {
      return errorResponse({
        code: 'NOT_FOUND',
        message: 'Category not found',
        status: 404,
      });
    }
    
    // 创建产品
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
      },
    });
    
    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        weight: product.weight ? Number(product.weight) : null,
      },
      message: 'Product created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to create product',
      status: 500,
    });
  }
}
