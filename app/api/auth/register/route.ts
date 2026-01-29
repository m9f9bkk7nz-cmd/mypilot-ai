import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { withRateLimit } from "@/lib/middleware/rateLimit";
import { rateLimitConfigs, logSecurityEvent, getClientIP, validatePasswordStrength } from "@/lib/security";

async function registerHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // 验证密码强度
    const passwordStrength = validatePasswordStrength(validatedData.password);
    if (!passwordStrength.isStrong) {
      return NextResponse.json(
        {
          error: {
            code: "WEAK_PASSWORD",
            message: "Password does not meet security requirements",
            details: passwordStrength.suggestions.map((suggestion) => ({
              field: "password",
              message: suggestion,
            })),
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_EXISTS",
            message: "A user with this email already exists",
            details: [
              {
                field: "email",
                value: validatedData.email,
                constraint: "unique",
              },
            ],
            requestId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // 记录注册成功
    logSecurityEvent({
      event: 'USER_REGISTERED',
      userId: user.id,
      ip: getClientIP(req),
      userAgent: req.headers.get('user-agent') || undefined,
      details: {
        email: user.email,
        name: user.name,
      },
      severity: 'low',
    });

    return NextResponse.json(
      {
        user,
        message: "User registered successfully",
      },
      { status: 201 }
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

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during registration",
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}


// 应用速率限制
export const POST = withRateLimit(registerHandler, rateLimitConfigs.register);
