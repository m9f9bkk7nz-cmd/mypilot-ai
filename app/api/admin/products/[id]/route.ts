import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  sku: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  inventory: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional(),
});

// 验证管理员权限
async function verifyAdmin(session: any) {
  if (!session?.user?.id) {
    return false;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  
  return user?.role === 'ADMIN';
}

// PUT /api/admin/products/[id] - 更新产品（管理员）
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    const isAdmin = await verifyAdmin(session);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    const body = await request.json();
    
    // 验证输入
    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const updateData = validation.data;
    
    // 检查产品是否存在
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 如果更新 slug 或 sku，检查是否已存在
    if (updateData.slug || updateData.sku) {
      const existing = await prisma.product.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(updateData.slug ? [{ slug: updateData.slug }] : []),
                ...(updateData.sku ? [{ sku: updateData.sku }] : []),
              ],
            },
          ],
        },
      });
      
      if (existing) {
        return NextResponse.json(
          { error: 'Product with this slug or SKU already exists' },
          { status: 422 }
        );
      }
    }
    
    // 如果更新分类，验证分类存在
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }
    
    // 更新产品
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
    
    return NextResponse.json({
      product: {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        comparePrice: updatedProduct.comparePrice ? Number(updatedProduct.comparePrice) : null,
        costPrice: updatedProduct.costPrice ? Number(updatedProduct.costPrice) : null,
        weight: updatedProduct.weight ? Number(updatedProduct.weight) : null,
      },
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - 删除产品（管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    const isAdmin = await verifyAdmin(session);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    // 检查产品是否存在
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 检查是否有关联的订单项
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });
    
    if (orderItems) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider unpublishing instead.' },
        { status: 422 }
      );
    }
    
    // 删除产品
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
