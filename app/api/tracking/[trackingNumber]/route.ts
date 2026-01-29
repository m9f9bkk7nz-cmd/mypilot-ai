import { NextRequest, NextResponse } from "next/server";
import {
  getOrderByTrackingNumber,
  getTrackingTimeline,
  isValidTrackingNumber,
} from "@/lib/tracking";

/**
 * GET /api/tracking/[trackingNumber]
 * Get order tracking information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { trackingNumber } = params;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    // Validate tracking number format
    if (!isValidTrackingNumber(trackingNumber)) {
      return NextResponse.json(
        { error: "Invalid tracking number format" },
        { status: 400 }
      );
    }

    // Get order by tracking number
    const order = await getOrderByTrackingNumber(trackingNumber);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found with this tracking number" },
        { status: 404 }
      );
    }

    // Get tracking timeline
    const timeline = getTrackingTimeline(order);

    // Return tracking information (without sensitive data)
    return NextResponse.json({
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      orderNumber: order.orderNumber,
      status: order.status,
      estimatedDelivery: null, // Can be calculated based on shipping method
      shippingAddress: {
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        postalCode: order.shippingAddress.postalCode,
      },
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.product.images[0] || null,
      })),
      timeline,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("Get tracking error:", error);
    return NextResponse.json(
      { error: "Failed to get tracking information" },
      { status: 500 }
    );
  }
}
