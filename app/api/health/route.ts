import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'operational',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          api: 'operational',
        },
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}
