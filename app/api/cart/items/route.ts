import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { randomBytes } from 'crypto';

// POST /api/cart/items - 添加商品到购物车
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let sessionId = request.cookies.get('cart_session')?.value;
    
    const body = await request.json();
    const { productId, quantity } = body;
    
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      );
    }
    
    // 验证产品存在且有库存
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, inventory: true, published: true },
    });
    
    if (!product || !product.published) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.inventory < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory', available: product.inventory },
        { status: 422 }
      );
    }
    
    // 获取或创建购物车
    let cart;
    
    if (session?.user?.id) {
      // 已登录用户
      cart = await prisma.cart.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
        },
        update: {},
      });
    } else {
      // 游客用户
      if (!sessionId) {
        sessionId = randomBytes(32).toString('hex');
      }
      
      cart = await prisma.cart.upsert({
        where: {
          sessionId,
        },
        create: {
          sessionId,
        },
        update: {},
      });
    }
    
    // 检查商品是否已在购物车中
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    
    if (existingItem) {
      // 更新数量
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.inventory) {
        return NextResponse.json(
          { error: 'Quantity exceeds available inventory', available: product.inventory },
          { status: 422 }
        );
      }
      
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      // 创建新项目
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
    
    const response = NextResponse.json({
      message: 'Product added to cart successfully',
    });
    
    // 为游客设置 session cookie
    if (!session?.user?.id && sessionId) {
      response.cookies.set('cart_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 天
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add product to cart' },
      { status: 500 }
    );
  }
}
