import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/shipping-rates
 * Get all shipping rates (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const active = searchParams.get("active");

    const rates = await prisma.shippingRate.findMany({
      where: {
        ...(country && { country }),
        ...(active !== null && { active: active === "true" }),
      },
      orderBy: [{ country: "asc" }, { minWeight: "asc" }],
    });

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Get shipping rates error:", error);
    return NextResponse.json(
      { error: "Failed to get shipping rates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/shipping-rates
 * Create a new shipping rate (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      country,
      minWeight,
      maxWeight,
      price,
      currency,
      estimatedDays,
      active,
    } = body;

    // Validation
    if (
      !name ||
      !country ||
      minWeight === undefined ||
      maxWeight === undefined ||
      price === undefined ||
      !currency ||
      estimatedDays === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (minWeight < 0 || maxWeight < 0 || price < 0 || estimatedDays < 0) {
      return NextResponse.json(
        { error: "Values must be non-negative" },
        { status: 400 }
      );
    }

    if (minWeight > maxWeight) {
      return NextResponse.json(
        { error: "Min weight must be less than or equal to max weight" },
        { status: 400 }
      );
    }

    const rate = await prisma.shippingRate.create({
      data: {
        name,
        description: description || null,
        country,
        minWeight,
        maxWeight,
        price,
        currency,
        estimatedDays,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("Create shipping rate error:", error);
    return NextResponse.json(
      { error: "Failed to create shipping rate" },
      { status: 500 }
    );
  }
}
