import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordResetConfirmSchema } from "@/lib/validations/auth";
import { z } from "zod";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = passwordResetConfirmSchema.parse(body);

    // Hash the token to match stored format
    const hashedToken = crypto
      .createHash("sha256")
      .update(validatedData.token)
      .digest("hex");

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired reset token",
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(validatedData.password, 12);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),
      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          used: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Password has been reset successfully",
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

    console.error("Password reset confirm error:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while resetting your password",
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
