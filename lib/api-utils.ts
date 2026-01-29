import { NextResponse } from 'next/server';
import { prisma } from './prisma';

// ============================================
// 统一的 API 响应格式
// ============================================

interface ErrorResponseOptions {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

/**
 * 创建统一格式的错误响应
 */
export function errorResponse({ code, message, status, details }: ErrorResponseOptions) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...(details && { details }),
      },
    },
    { status }
  );
}

/**
 * 创建成功响应
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

// ============================================
// 管理员权限验证
// ============================================

interface Session {
  user?: {
    id?: string;
    role?: string;
  };
}

/**
 * 验证管理员权限（共享函数，避免重复代码）
 */
export async function verifyAdminAccess(session: Session | null): Promise<boolean> {
  if (!session?.user?.id) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role === 'ADMIN';
}

/**
 * 验证用户是否已登录
 */
export function verifyAuthenticated(session: Session | null): boolean {
  return !!session?.user?.id;
}

// ============================================
// 分页工具
// ============================================

interface PaginationParams {
  page?: string | null;
  limit?: string | null;
  maxLimit?: number;
}

interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

/**
 * 解析分页参数
 */
export function parsePagination({
  page,
  limit,
  maxLimit = 100,
}: PaginationParams): PaginationResult {
  const parsedPage = Math.max(1, parseInt(page || '1', 10) || 1);
  const parsedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit || '20', 10) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
}

/**
 * 生成分页响应元数据
 */
export function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

// ============================================
// 输入验证工具
// ============================================

/**
 * 清理搜索输入（防止过长输入和特殊字符）
 */
export function sanitizeSearchInput(input: string | null, maxLength = 100): string {
  if (!input) return '';
  return input.trim().slice(0, maxLength);
}

/**
 * 验证 UUID 格式
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
