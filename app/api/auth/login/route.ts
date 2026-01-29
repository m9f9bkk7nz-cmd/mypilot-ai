import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { withRateLimit } from "@/lib/middleware/rateLimit";
import { rateLimitConfigs, logSecurityEvent, getClientIP } from "@/lib/security";

/**
 * This endpoint provides additional login functionality beyond NextAuth.
 * The primary authentication is handled by NextAuth at /api/auth/[...nextauth]
 * This endpoint can be used for custom login flows or API authentication.
 */
async function loginHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
      },
    });

    if (!user || !user.password) {
      // 记录失败的登录尝试
      logSecurityEvent({
        event: 'LOGIN_FAILED',
        userId: undefined,
        ip: getClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        details: {
          email: validatedData.email,
          reason: 'User not found or no password',
        },
        severity: 'low',
      });

      return NextResponse.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      // 记录失败的登录尝试
      logSecurityEvent({
        event: 'LOGIN_FAILED',
        userId: user.id,
        ip: getClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        details: {
          email: validatedData.email,
          reason: 'Invalid password',
        },
        severity: 'medium',
      });

      return NextResponse.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      );
    }

    // 记录成功的登录
    logSecurityEvent({
      event: 'LOGIN_SUCCESS',
      userId: user.id,
      ip: getClientIP(req),
      userAgent: req.headers.get('user-agent') || undefined,
      details: {
        email: validatedData.email,
      },
      severity: 'low',
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during login",
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}


// 应用速率限制
export const POST = withRateLimit(loginHandler, rateLimitConfigs.login);
