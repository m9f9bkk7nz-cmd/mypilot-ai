import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { constructWebhookEvent } from "@/lib/stripe";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  OrderEmailData,
} from "@/lib/email";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("No orderId in payment intent metadata");
    return;
  }

  // Find order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
    console.error(`Order not found: ${orderId}`);
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: "PROCESSING",
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  // Send confirmation email
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
    console.error("Failed to send confirmation email:", emailError);
  }

  console.log(`Payment succeeded for order: ${order.orderNumber}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("No orderId in payment intent metadata");
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "FAILED",
      status: "CANCELLED",
    },
  });

  console.log(`Payment failed for order: ${orderId}`);
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error("No payment intent ID in charge");
    return;
  }

  // Find order by payment intent
  const order = await prisma.order.findFirst({
    where: {
      stripePaymentIntentId: paymentIntentId,
    },
    include: {
      user: true,
    },
  });

  if (!order) {
    console.error(`Order not found for payment intent: ${paymentIntentId}`);
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "REFUNDED",
      status: "CANCELLED",
    },
  });

  // Send notification email
  try {
    await sendOrderStatusUpdateEmail(
      order.user.email,
      order.orderNumber,
      order.user.name || order.user.email,
      "CANCELLED"
    );
  } catch (emailError) {
    console.error("Failed to send refund notification:", emailError);
  }

  console.log(`Refund processed for order: ${order.orderNumber}`);
}
