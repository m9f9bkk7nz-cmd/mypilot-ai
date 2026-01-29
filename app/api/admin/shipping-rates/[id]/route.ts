import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/admin/shipping-rates/[id]
 * Update a shipping rate (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (minWeight !== undefined && minWeight < 0) {
      return NextResponse.json(
        { error: "Min weight must be non-negative" },
        { status: 400 }
      );
    }

    if (maxWeight !== undefined && maxWeight < 0) {
      return NextResponse.json(
        { error: "Max weight must be non-negative" },
        { status: 400 }
      );
    }

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { error: "Price must be non-negative" },
        { status: 400 }
      );
    }

    if (estimatedDays !== undefined && estimatedDays < 0) {
      return NextResponse.json(
        { error: "Estimated days must be non-negative" },
        { status: 400 }
      );
    }

    if (
      minWeight !== undefined &&
      maxWeight !== undefined &&
      minWeight > maxWeight
    ) {
      return NextResponse.json(
        { error: "Min weight must be less than or equal to max weight" },
        { status: 400 }
      );
    }

    const rate = await prisma.shippingRate.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(country && { country }),
        ...(minWeight !== undefined && { minWeight }),
        ...(maxWeight !== undefined && { maxWeight }),
        ...(price !== undefined && { price }),
        ...(currency && { currency }),
        ...(estimatedDays !== undefined && { estimatedDays }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ rate });
  } catch (error) {
    console.error("Update shipping rate error:", error);
    return NextResponse.json(
      { error: "Failed to update shipping rate" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/shipping-rates/[id]
 * Delete a shipping rate (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.shippingRate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete shipping rate error:", error);
    return NextResponse.json(
      { error: "Failed to delete shipping rate" },
      { status: 500 }
    );
  }
}
