import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { calculateShippingCost, calculateCartWeight } from "@/lib/shipping";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/shipping/calculate
 * Calculate shipping cost for cart or custom weight
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const { country, weight, cartId, shippingMethod } = body;

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    let totalWeight = weight;

    // If cartId is provided, calculate weight from cart items
    if (cartId) {
      // Verify cart belongs to user (if logged in)
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (user) {
          const cart = await prisma.cart.findUnique({
            where: { id: cartId },
          });

          if (cart && cart.userId !== user.id) {
            return NextResponse.json(
              { error: "Unauthorized" },
              { status: 403 }
            );
          }
        }
      }

      totalWeight = await calculateCartWeight(cartId);
    }

    if (!totalWeight || totalWeight <= 0) {
      return NextResponse.json(
        { error: "Weight must be greater than 0" },
        { status: 400 }
      );
    }

    // Calculate shipping options
    const shippingOptions = await calculateShippingCost({
      country,
      weight: totalWeight,
      shippingMethod,
    });

    if (shippingOptions.length === 0) {
      return NextResponse.json(
        {
          error: "No shipping options available for this destination",
          weight: totalWeight,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shippingOptions,
      weight: totalWeight,
      country,
    });
  } catch (error) {
    console.error("Calculate shipping error:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping cost" },
      { status: 500 }
    );
  }
}
