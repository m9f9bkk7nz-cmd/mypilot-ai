import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { passwordResetRequestSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";
import { withRateLimit } from "@/lib/middleware/rateLimit";
import { rateLimitConfigs, logSecurityEvent, getClientIP } from "@/lib/security";

async function passwordResetRequestHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = passwordResetRequestSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Set expiration to 1 hour from now
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Invalidate any existing tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          used: false,
        },
        data: {
          used: true,
        },
      });

      // Create new reset token
      await prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send reset email
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(user.email, resetUrl);

      // 记录密码重置请求
      logSecurityEvent({
        event: 'PASSWORD_RESET_REQUESTED',
        userId: user.id,
        ip: getClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        details: {
          email: user.email,
        },
        severity: 'medium',
      });
    } else {
      // 记录对不存在用户的密码重置尝试
      logSecurityEvent({
        event: 'PASSWORD_RESET_REQUESTED',
        userId: undefined,
        ip: getClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        details: {
          email: validatedData.email,
          userExists: false,
        },
        severity: 'low',
      });
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent",
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

    console.error("Password reset request error:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while processing your request",
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}


// 应用速率限制
export const POST = withRateLimit(passwordResetRequestHandler, rateLimitConfigs.passwordReset);
