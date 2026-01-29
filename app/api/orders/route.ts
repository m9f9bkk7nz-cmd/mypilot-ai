import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { decreaseInventoryBatch, checkInventoryBatch } from '@/lib/inventory';
import { logSecurityEvent, getClientIP } from '@/lib/security';

// 生成订单号
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// 计算配送费用（简化版本）
function calculateShippingCost(country: string, weight: number): number {
  // 基础费率
  const baseRates: Record<string, number> = {
    US: 10,
    CN: 15,
    JP: 12,
    KR: 12,
    EU: 20,
  };
  
  const baseRate = baseRates[country] || baseRates.EU;
  
  // 重量附加费（每公斤）
  const weightSurcharge = Math.max(0, weight - 1) * 2;
  
  return baseRate + weightSurcharge;
}

// 计算税费（简化版本）
function calculateTax(subtotal: number, country: string): number {
  const taxRates: Record<string, number> = {
    US: 0.08,
    CN: 0.13,
    JP: 0.10,
    KR: 0.10,
    EU: 0.20,
  };
  
  const taxRate = taxRates[country] || 0;
  return subtotal * taxRate;
}

// POST /api/orders - 创建订单
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { shippingAddressId, shippingMethod, paymentMethod, currency = 'USD' } = body;
    
    if (!shippingAddressId || !shippingMethod || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 获取购物车
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // 验证地址
    const address = await prisma.address.findUnique({
      where: {
        id: shippingAddressId,
      },
    });
    
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
    }
    
    // 验证库存并计算总重量
    const inventoryItems = cart.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    
    const inventoryChecks = await checkInventoryBatch(inventoryItems);
    const insufficientItems = inventoryChecks.filter((check) => !check.available);
    
    if (insufficientItems.length > 0) {
      // 记录库存不足事件
      logSecurityEvent({
        event: 'INSUFFICIENT_INVENTORY',
        userId: session.user.id,
        ip: getClientIP(request) || undefined,
        details: {
          insufficientItems: insufficientItems.map((item) => ({
            productId: item.productId,
            requested: item.requested,
            available: item.currentStock,
          })),
        },
        severity: 'low',
      });
      
      return NextResponse.json(
        { 
          error: 'Insufficient inventory', 
          insufficientItems: insufficientItems.map((item) => ({
            productId: item.productId,
            requested: item.requested,
            available: item.currentStock,
          })),
        },
        { status: 422 }
      );
    }
    
    let totalWeight = 0;
    for (const item of cart.items) {
      totalWeight += Number(item.product.weight || 1) * item.quantity;
    }
    
    // 计算订单金额
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    
    const shippingCost = calculateShippingCost(address.country, totalWeight);
    const tax = calculateTax(subtotal, address.country);
    const total = subtotal + shippingCost + tax;
    
    // 使用事务创建订单并减少库存
    const order = await prisma.$transaction(async (tx) => {
      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          status: 'PENDING',
          subtotal,
          shippingCost,
          tax,
          total,
          currency,
          shippingAddressId,
          shippingMethod,
          paymentMethod,
          paymentStatus: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              name: item.product.name,
              sku: item.product.sku,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });
      
      // 清空购物车
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
      
      return newOrder;
    });
    
    // 减少库存（使用原子操作）
    const inventoryResult = await decreaseInventoryBatch(inventoryItems);
    
    if (!inventoryResult.success) {
      // 如果库存减少失败，记录错误（订单已创建，需要人工处理）
      logSecurityEvent({
        event: 'INVENTORY_DECREASE_FAILED',
        userId: session.user.id,
        ip: getClientIP(request) || undefined,
        details: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          failedItems: inventoryResult.failedItems,
        },
        severity: 'high',
      });
    }
    
    // 记录订单创建事件
    logSecurityEvent({
      event: 'ORDER_CREATED',
      userId: session.user.id,
      ip: getClientIP(request) || undefined,
      details: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
      },
      severity: 'low',
    });
    
    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        tax: Number(order.tax),
        total: Number(order.total),
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - 获取用户订单列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const where: any = {
      userId: session.user.id,
    };
    
    if (status) {
      where.status = status;
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
          shippingAddress: true,
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
      total: Number(order.total),
      currency: order.currency,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
