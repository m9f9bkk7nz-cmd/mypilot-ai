import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getLowStockProducts, getOutOfStockProducts } from '@/lib/inventory';

/**
 * GET /api/admin/inventory/low-stock
 * 获取低库存和缺货产品（仅管理员）
 */
export async function GET(req: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Admin access required',
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 403 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const threshold = parseInt(searchParams.get('threshold') || '10');

    // 获取低库存和缺货产品
    const [lowStockProducts, outOfStockProducts] = await Promise.all([
      getLowStockProducts(threshold),
      getOutOfStockProducts(),
    ]);

    return NextResponse.json(
      {
        lowStock: {
          products: lowStockProducts,
          count: lowStockProducts.length,
          threshold,
        },
        outOfStock: {
          products: outOfStockProducts,
          count: outOfStockProducts.length,
        },
        summary: {
          totalLowStock: lowStockProducts.length,
          totalOutOfStock: outOfStockProducts.length,
          needsAttention: lowStockProducts.length + outOfStockProducts.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Low stock check error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while checking inventory',
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
