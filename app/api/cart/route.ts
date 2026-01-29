import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/cart - 获取购物车
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart_session')?.value;
    
    let cart;
    
    if (session?.user?.id) {
      // 已登录用户：从数据库获取购物车
      cart = await prisma.cart.findUnique({
        where: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  inventory: true,
                },
              },
            },
          },
        },
      });
    } else if (sessionId) {
      // 游客：从 session 获取购物车
      cart = await prisma.cart.findUnique({
        where: {
          sessionId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }
    
    if (!cart) {
      return NextResponse.json({
        cart: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      });
    }
    
    // 计算总价和商品数量
    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // 格式化购物车数据
    const formattedCart = {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        image: item.product.images[0] || null,
        quantity: item.quantity,
        maxQuantity: item.product.inventory,
        subtotal: Number(item.product.price) * item.quantity,
      })),
      total,
      itemCount,
    };
    
    return NextResponse.json({
      cart: formattedCart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - 清空购物车
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart_session')?.value;
    
    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id,
          },
        },
      });
    } else if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            sessionId,
          },
        },
      });
    }
    
    return NextResponse.json({
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
