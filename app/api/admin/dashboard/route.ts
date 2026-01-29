import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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

// GET /api/admin/dashboard - 获取仪表板数据（管理员）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const isAdmin = await verifyAdmin(session);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    // 计算日期范围
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    // 获取关键指标
    const [
      totalOrders,
      previousTotalOrders,
      totalRevenue,
      previousTotalRevenue,
      totalProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // 最近30天订单数
      prisma.order.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: {
            not: 'CANCELLED',
          },
        },
      }),
      // 前30天订单数（用于计算趋势）
      prisma.order.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
          status: {
            not: 'CANCELLED',
          },
        },
      }),
      // 最近30天总销售额
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: {
          total: true,
        },
      }),
      // 前30天总销售额
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: {
          total: true,
        },
      }),
      // 产品总数
      prisma.product.count({
        where: {
          published: true,
        },
      }),
      // 低库存产品
      prisma.product.findMany({
        where: {
          published: true,
          inventory: {
            lte: prisma.product.fields.lowStockThreshold,
          },
        },
        select: {
          id: true,
          name: true,
          sku: true,
          inventory: true,
          lowStockThreshold: true,
        },
        take: 10,
        orderBy: {
          inventory: 'asc',
        },
      }),
      // 最近订单
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);
    
    // 计算趋势百分比
    const ordersTrend = previousTotalOrders > 0
      ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100
      : 0;
    
    const currentRevenue = Number(totalRevenue._sum.total || 0);
    const previousRevenue = Number(previousTotalRevenue._sum.total || 0);
    const revenueTrend = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;
    
    // 格式化数据
    const dashboard = {
      metrics: {
        totalRevenue: {
          value: currentRevenue,
          trend: Math.round(revenueTrend * 10) / 10,
          currency: 'USD',
        },
        totalOrders: {
          value: totalOrders,
          trend: Math.round(ordersTrend * 10) / 10,
        },
        totalProducts: {
          value: totalProducts,
        },
        lowStockCount: {
          value: lowStockProducts.length,
        },
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user.name,
        email: order.user.email,
        status: order.status,
        total: Number(order.total),
        currency: order.currency,
        createdAt: order.createdAt,
      })),
      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        inventory: product.inventory,
        threshold: product.lowStockThreshold,
      })),
    };
    
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
