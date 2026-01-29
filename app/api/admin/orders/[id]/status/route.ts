import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
  notes: z.string().optional(),
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

// PUT /api/admin/orders/[id]/status - 更新订单状态（管理员）
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
    const validation = updateStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { status, trackingNumber, trackingUrl, notes } = validation.data;
    
    // 获取订单
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
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
    
    // 更新订单
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(trackingUrl && { trackingUrl }),
        ...(notes && { notes }),
      },
    });
    
    // TODO: 发送状态更新邮件
    // await sendOrderStatusEmail(order.user.email, {
    //   orderNumber: order.orderNumber,
    //   status,
    //   trackingNumber,
    //   trackingUrl,
    // });
    
    return NextResponse.json({
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        trackingUrl: updatedOrder.trackingUrl,
        notes: updatedOrder.notes,
        updatedAt: updatedOrder.updatedAt,
      },
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
