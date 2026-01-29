import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcrypt';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

// GET /api/user/profile - 获取用户资料
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // 验证输入
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, currentPassword, newPassword } = validation.data;
    
    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const updateData: any = {};
    
    // 更新名称
    if (name) {
      updateData.name = name;
    }
    
    // 更新邮箱
    if (email && email !== user.email) {
      // 检查邮箱是否已被使用
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 422 }
        );
      }
      
      updateData.email = email;
    }
    
    // 更新密码
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set new password' },
          { status: 400 }
        );
      }
      
      // 验证当前密码
      const bcrypt = require('bcrypt');
      const isValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      // 哈希新密码
      updateData.password = await hash(newPassword, 10);
    }
    
    // 更新用户
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
