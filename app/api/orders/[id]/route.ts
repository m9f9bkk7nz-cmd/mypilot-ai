import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/orders/[id] - 获取订单详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      tax: Number(order.tax),
      total: Number(order.total),
      currency: order.currency,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productSlug: item.product.slug,
        name: item.name,
        sku: item.sku,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.product.images[0] || null,
        subtotal: Number(item.price) * item.quantity,
      })),
      shippingAddress: order.shippingAddress,
      user: order.user,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
    
    return NextResponse.json({
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
