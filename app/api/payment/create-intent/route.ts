import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { createPaymentIntent } from "@/lib/stripe";

/**
 * POST /api/payment/create-intent
 * Create a Stripe payment intent for an order
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if order is already paid
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      order.total,
      order.currency,
      {
        orderId: order.id,
        userId: order.userId,
        customerEmail: order.user.email,
      }
    );

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
