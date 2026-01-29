import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/cart/merge - 合并游客购物车到用户购物车（登录时调用）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const sessionId = request.cookies.get('cart_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({
        message: 'No guest cart to merge',
      });
    }
    
    // 获取游客购物车
    const guestCart = await prisma.cart.findUnique({
      where: {
        sessionId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                inventory: true,
              },
            },
          },
        },
      },
    });
    
    if (!guestCart || guestCart.items.length === 0) {
      return NextResponse.json({
        message: 'No guest cart items to merge',
      });
    }
    
    // 获取或创建用户购物车
    const userCart = await prisma.cart.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
      },
      update: {},
      include: {
        items: true,
      },
    });
    
    // 合并购物车项目
    for (const guestItem of guestCart.items) {
      // 检查用户购物车中是否已有该商品
      const existingItem = userCart.items.find(
        (item) => item.productId === guestItem.productId
      );
      
      if (existingItem) {
        // 合并数量（不超过库存）
        const newQuantity = Math.min(
          existingItem.quantity + guestItem.quantity,
          guestItem.product.inventory
        );
        
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: newQuantity,
          },
        });
      } else {
        // 添加新项目（确保不超过库存）
        const quantity = Math.min(guestItem.quantity, guestItem.product.inventory);
        
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity,
          },
        });
      }
    }
    
    // 删除游客购物车
    await prisma.cart.delete({
      where: {
        id: guestCart.id,
      },
    });
    
    const response = NextResponse.json({
      message: 'Cart merged successfully',
    });
    
    // 清除 session cookie
    response.cookies.delete('cart_session');
    
    return response;
  } catch (error) {
    console.error('Error merging cart:', error);
    return NextResponse.json(
      { error: 'Failed to merge cart' },
      { status: 500 }
    );
  }
}
