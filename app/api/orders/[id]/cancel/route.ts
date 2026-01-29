import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { increaseInventoryBatch } from '@/lib/inventory';
import { logSecurityEvent, getClientIP } from '@/lib/security';

// POST /api/orders/[id]/cancel - 取消订单
export async function POST(
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
    
    // 获取订单
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
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
    
    // 验证订单状态（仅未发货订单可取消）
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      return NextResponse.json(
        { error: 'Cannot cancel shipped or delivered orders' },
        { status: 422 }
      );
    }
    
    if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Order is already cancelled' },
        { status: 422 }
      );
    }
    
    // 使用事务取消订单
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
        paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : 'PENDING',
      },
    });
    
    // 恢复库存（使用原子操作）
    const inventoryItems = order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    
    const inventoryResult = await increaseInventoryBatch(inventoryItems);
    
    if (!inventoryResult.success) {
      // 记录库存恢复失败事件
      logSecurityEvent({
        event: 'INVENTORY_RESTORE_FAILED',
        userId: session.user.id,
        ip: getClientIP(request) || undefined,
        details: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        severity: 'high',
      });
    }
    
    // 记录订单取消事件
    logSecurityEvent({
      event: 'ORDER_CANCELLED',
      userId: session.user.id,
      ip: getClientIP(request) || undefined,
      details: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
      },
      severity: 'low',
    });
    
    // TODO: 如果已支付，触发退款流程
    // if (order.paymentStatus === 'PAID') {
    //   await processRefund(order.paymentId, order.total);
    // }
    
    // TODO: 发送取消确认邮件
    // await sendOrderCancellationEmail(order);
    
    return NextResponse.json({
      message: 'Order cancelled successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: 'CANCELLED',
      },
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
