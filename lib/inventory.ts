import { prisma } from './prisma';

/**
 * 库存管理服务
 * 实现并发控制，防止超卖
 */

export interface InventoryCheckResult {
  available: boolean;
  currentStock: number;
  requested: number;
  productId: string;
}

export interface InventoryReservation {
  productId: string;
  quantity: number;
  reservedAt: Date;
  expiresAt: Date;
}

/**
 * 检查库存是否充足
 */
export async function checkInventory(
  productId: string,
  quantity: number
): Promise<InventoryCheckResult> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  return {
    available: product.stock >= quantity,
    currentStock: product.stock,
    requested: quantity,
    productId,
  };
}

/**
 * 批量检查库存
 */
export async function checkInventoryBatch(
  items: Array<{ productId: string; quantity: number }>
): Promise<InventoryCheckResult[]> {
  const results = await Promise.all(
    items.map((item) => checkInventory(item.productId, item.quantity))
  );

  return results;
}

/**
 * 减少库存（使用数据库事务确保原子性）
 * 使用乐观锁防止并发问题
 */
export async function decreaseInventory(
  productId: string,
  quantity: number
): Promise<{ success: boolean; newStock: number }> {
  try {
    // 使用 Prisma 事务和原子更新
    const result = await prisma.$transaction(async (tx) => {
      // 1. 获取当前库存（带锁）
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { stock: true, id: true },
      });

      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      // 2. 检查库存是否充足
      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`
        );
      }

      // 3. 原子性减少库存
      const updated = await tx.product.update({
        where: {
          id: productId,
          // 乐观锁：确保库存没有被其他事务修改
          stock: {
            gte: quantity,
          },
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
        select: { stock: true },
      });

      return updated.stock;
    });

    return {
      success: true,
      newStock: result,
    };
  } catch (error) {
    console.error('Failed to decrease inventory:', error);
    return {
      success: false,
      newStock: 0,
    };
  }
}

/**
 * 批量减少库存
 */
export async function decreaseInventoryBatch(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean; failedItems: string[] }> {
  const failedItems: string[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, id: true, name: true },
        });

        if (!product) {
          failedItems.push(item.productId);
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          failedItems.push(item.productId);
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        await tx.product.update({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    return {
      success: true,
      failedItems: [],
    };
  } catch (error) {
    console.error('Failed to decrease inventory batch:', error);
    return {
      success: false,
      failedItems,
    };
  }
}

/**
 * 增加库存（订单取消或退货时）
 */
export async function increaseInventory(
  productId: string,
  quantity: number
): Promise<{ success: boolean; newStock: number }> {
  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
      select: { stock: true },
    });

    return {
      success: true,
      newStock: updated.stock,
    };
  } catch (error) {
    console.error('Failed to increase inventory:', error);
    return {
      success: false,
      newStock: 0,
    };
  }
}

/**
 * 批量增加库存
 */
export async function increaseInventoryBatch(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean }> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to increase inventory batch:', error);
    return { success: false };
  }
}

/**
 * 获取低库存产品列表
 */
export async function getLowStockProducts(threshold: number = 10) {
  return await prisma.product.findMany({
    where: {
      stock: {
        lte: threshold,
        gt: 0,
      },
    },
    select: {
      id: true,
      name: true,
      stock: true,
      price: true,
    },
    orderBy: {
      stock: 'asc',
    },
  });
}

/**
 * 获取缺货产品列表
 */
export async function getOutOfStockProducts() {
  return await prisma.product.findMany({
    where: {
      stock: 0,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });
}
