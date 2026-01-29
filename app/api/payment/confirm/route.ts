import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getPaymentIntent } from "@/lib/stripe";
import { sendOrderConfirmationEmail, OrderEmailData } from "@/lib/email";

/**
 * POST /api/payment/confirm
 * Confirm payment and update order status
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Get payment intent from Stripe
    const paymentIntent = await getPaymentIntent(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
        paidAt: new Date(),
      },
    });

    // Send order confirmation email
    try {
      const emailData: OrderEmailData = {
        orderNumber: order.orderNumber,
        customerName: order.user.name || order.user.email,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2 || undefined,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode,
          country: order.shippingAddress.country,
        },
      };

      await sendOrderConfirmationEmail(order.user.email, emailData);
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
