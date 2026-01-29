import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// PUT /api/reviews/[id] - 更新评价
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
    const { rating, comment, images } = body;
    
    // 获取评价
    const review = await prisma.review.findUnique({
      where: { id },
    });
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // 验证权限
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 验证评分
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // 更新评价
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment }),
        ...(images && { images }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      review: {
        id: updatedReview.id,
        userId: updatedReview.userId,
        userName: updatedReview.user.name,
        userImage: updatedReview.user.image,
        productId: updatedReview.productId,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        images: updatedReview.images,
        verified: updatedReview.verified,
        approved: updatedReview.approved,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - 删除评价
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
    
    // 获取评价
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // 验证权限（用户本人或管理员）
    const isOwner = review.userId === session.user.id;
    const isAdmin = review.user.role === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 删除评价
    await prisma.review.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
