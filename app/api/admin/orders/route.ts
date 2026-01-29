import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { 
  verifyAdminAccess, 
  errorResponse, 
  parsePagination, 
  paginationMeta,
  sanitizeSearchInput 
} from '@/lib/api-utils';

// GET /api/admin/orders - 获取所有订单（管理员）
export async function GET(request: NextRequest) {
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
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = sanitizeSearchInput(searchParams.get('search'));
    const { page, limit, skip } = parsePagination({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
          shippingAddress: {
            select: {
              country: true,
              city: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
      currency: order.currency,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      customer: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: paginationMeta(page, limit, total),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch orders',
      status: 500,
    });
  }
}
