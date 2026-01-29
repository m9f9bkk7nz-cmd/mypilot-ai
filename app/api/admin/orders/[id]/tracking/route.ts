import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { assignTrackingToOrder, generateTrackingUrl } from "@/lib/tracking";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

/**
 * POST /api/admin/orders/[id]/tracking
 * Assign tracking number to order (admin only)
 */
export async function POST(
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
    const { carrier, customTrackingNumber } = body;

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let trackingNumber: string;
    let trackingUrl: string;

    if (customTrackingNumber) {
      // Use custom tracking number (e.g., from carrier)
      trackingNumber = customTrackingNumber;
      trackingUrl = generateTrackingUrl(customTrackingNumber, carrier);

      await prisma.order.update({
        where: { id: params.id },
        data: {
          trackingNumber,
          trackingUrl,
          status: "SHIPPED",
        },
      });
    } else {
      // Generate tracking number automatically
      const tracking = await assignTrackingToOrder(params.id, carrier);
      trackingNumber = tracking.trackingNumber;
      trackingUrl = tracking.trackingUrl;
    }

    // Send notification email
    try {
      await sendOrderStatusUpdateEmail(
        order.user.email,
        order.orderNumber,
        order.user.name || order.user.email,
        "SHIPPED",
        trackingNumber
      );
    } catch (emailError) {
      console.error("Failed to send tracking notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackingUrl,
    });
  } catch (error) {
    console.error("Assign tracking error:", error);
    return NextResponse.json(
      { error: "Failed to assign tracking number" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[id]/tracking
 * Update tracking information (admin only)
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
    const { trackingNumber, trackingUrl, carrier } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update tracking information
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        trackingNumber,
        trackingUrl: trackingUrl || generateTrackingUrl(trackingNumber, carrier),
      },
    });

    return NextResponse.json({
      success: true,
      trackingNumber: updatedOrder.trackingNumber,
      trackingUrl: updatedOrder.trackingUrl,
    });
  } catch (error) {
    console.error("Update tracking error:", error);
    return NextResponse.json(
      { error: "Failed to update tracking information" },
      { status: 500 }
    );
  }
}
