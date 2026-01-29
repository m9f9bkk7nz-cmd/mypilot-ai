/**
 * Order tracking service
 */

import { prisma } from "./prisma";

/**
 * Generate a unique tracking number
 * Format: TRACK-YYYYMMDD-XXXXX
 */
export function generateTrackingNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  // Generate random 5-digit number
  const random = Math.floor(10000 + Math.random() * 90000);
  
  return `TRACK-${year}${month}${day}-${random}`;
}

/**
 * Generate tracking URL based on carrier
 */
export function generateTrackingUrl(
  trackingNumber: string,
  carrier?: string
): string {
  // Default to generic tracking page
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  // If carrier is specified, generate carrier-specific URL
  const carrierUrls: Record<string, string> = {
    UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    FEDEX: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    // Add more carriers as needed
  };

  if (carrier && carrierUrls[carrier.toUpperCase()]) {
    return carrierUrls[carrier.toUpperCase()];
  }

  // Return internal tracking page
  return `${baseUrl}/track/${trackingNumber}`;
}

/**
 * Assign tracking number to order
 */
export async function assignTrackingToOrder(
  orderId: string,
  carrier?: string
): Promise<{ trackingNumber: string; trackingUrl: string }> {
  const trackingNumber = generateTrackingNumber();
  const trackingUrl = generateTrackingUrl(trackingNumber, carrier);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      trackingNumber,
      trackingUrl,
      status: "SHIPPED",
    },
  });

  return { trackingNumber, trackingUrl };
}

/**
 * Get order by tracking number
 */
export async function getOrderByTrackingNumber(trackingNumber: string) {
  return await prisma.order.findFirst({
    where: { trackingNumber },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });
}

/**
 * Tracking status timeline
 */
export interface TrackingEvent {
  date: Date;
  status: string;
  description: string;
  location?: string;
}

/**
 * Get tracking timeline for an order
 */
export function getTrackingTimeline(order: any): TrackingEvent[] {
  const events: TrackingEvent[] = [];

  // Order created
  events.push({
    date: order.createdAt,
    status: "Order Placed",
    description: "Your order has been placed successfully",
  });

  // Payment confirmed
  if (order.paidAt) {
    events.push({
      date: order.paidAt,
      status: "Payment Confirmed",
      description: "Payment has been confirmed",
    });
  }

  // Processing
  if (order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED") {
    events.push({
      date: order.updatedAt,
      status: "Processing",
      description: "Your order is being prepared for shipment",
    });
  }

  // Shipped
  if (order.status === "SHIPPED" || order.status === "DELIVERED") {
    events.push({
      date: order.updatedAt,
      status: "Shipped",
      description: `Your order has been shipped${order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ""}`,
    });
  }

  // Delivered
  if (order.status === "DELIVERED") {
    events.push({
      date: order.updatedAt,
      status: "Delivered",
      description: "Your order has been delivered",
    });
  }

  // Cancelled
  if (order.status === "CANCELLED") {
    events.push({
      date: order.updatedAt,
      status: "Cancelled",
      description: "Your order has been cancelled",
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Validate tracking number format
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  // Check our internal format: TRACK-YYYYMMDD-XXXXX
  const internalFormat = /^TRACK-\d{8}-\d{5}$/;
  
  if (internalFormat.test(trackingNumber)) {
    return true;
  }

  // Add validation for other carrier formats if needed
  return false;
}
