import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// PUT /api/cart/items/[id] - 更新购物车商品数量
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart_session')?.value;
    const { id } = params;
    
    const body = await request.json();
    const { quantity } = body;
    
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }
    
    // 获取购物车项目
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: {
          select: {
            inventory: true,
          },
        },
      },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    const isOwner = session?.user?.id
      ? cartItem.cart.userId === session.user.id
      : cartItem.cart.sessionId === sessionId;
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 验证库存
    if (quantity > cartItem.product.inventory) {
      return NextResponse.json(
        { error: 'Quantity exceeds available inventory', available: cartItem.product.inventory },
        { status: 422 }
      );
    }
    
    // 更新数量
    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
    
    return NextResponse.json({
      message: 'Cart item updated successfully',
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id] - 从购物车删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart_session')?.value;
    const { id } = params;
    
    // 获取购物车项目
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    const isOwner = session?.user?.id
      ? cartItem.cart.userId === session.user.id
      : cartItem.cart.sessionId === sessionId;
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 删除项目
    await prisma.cartItem.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: 'Cart item removed successfully',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
