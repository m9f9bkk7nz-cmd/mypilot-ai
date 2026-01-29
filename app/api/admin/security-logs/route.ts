import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getSecurityLogs, detectSuspiciousActivity } from '@/lib/security';

/**
 * GET /api/admin/security-logs
 * 获取安全日志（仅管理员）
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
    const limit = parseInt(searchParams.get('limit') || '100');
    const event = searchParams.get('event') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const ip = searchParams.get('ip') || undefined;

    // 获取安全日志
    const logs = getSecurityLogs({
      limit,
      event,
      severity: severity as 'low' | 'medium' | 'high' | 'critical' | undefined,
      userId,
      ip,
    });

    // 检测可疑活动
    const suspiciousActivities = detectSuspiciousActivity();

    return NextResponse.json(
      {
        logs,
        suspiciousActivities,
        total: logs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Security logs error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching security logs',
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
