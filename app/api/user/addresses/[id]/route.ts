import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(1).max(20).optional(),
  line1: z.string().min(1).max(200).optional(),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(1).max(20).optional(),
  country: z.string().min(2).max(2).optional(),
  isDefault: z.boolean().optional(),
});

// PUT /api/user/addresses/[id] - 更新地址
export async function PUT(
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
    const body = await request.json();
    
    // 验证输入
    const validation = addressSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    // 获取地址
    const address = await prisma.address.findUnique({
      where: { id },
    });
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const updateData = validation.data;
    
    // 如果设置为默认地址，取消其他地址的默认状态
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: {
            not: id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }
    
    // 更新地址
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json({
      address: updatedAddress,
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/addresses/[id] - 删除地址
export async function DELETE(
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
    
    // 获取地址
    const address = await prisma.address.findUnique({
      where: { id },
    });
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 删除地址
    await prisma.address.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
