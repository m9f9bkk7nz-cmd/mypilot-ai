import { NextResponse } from "next/server";
import { getAvailableShippingMethods } from "@/lib/shipping";

/**
 * GET /api/shipping/methods
 * Get all available shipping methods
 */
export async function GET() {
  try {
    const methods = await getAvailableShippingMethods();

    return NextResponse.json({
      methods,
    });
  } catch (error) {
    console.error("Get shipping methods error:", error);
    return NextResponse.json(
      { error: "Failed to get shipping methods" },
      { status: 500 }
    );
  }
}
