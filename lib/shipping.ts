/**
 * Shipping cost calculation service
 */

import { prisma } from "./prisma";

export interface ShippingCalculationParams {
  country: string;
  weight: number; // in kg
  shippingMethod?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  estimatedDays: number;
}

/**
 * Calculate shipping cost based on destination and weight
 */
export async function calculateShippingCost(
  params: ShippingCalculationParams
): Promise<ShippingOption[]> {
  const { country, weight, shippingMethod } = params;

  // Get applicable shipping rates
  const rates = await prisma.shippingRate.findMany({
    where: {
      country: {
        in: [country, "WORLDWIDE"], // Support country-specific and worldwide rates
      },
      minWeight: {
        lte: weight,
      },
      maxWeight: {
        gte: weight,
      },
      active: true,
      ...(shippingMethod && { name: shippingMethod }),
    },
    orderBy: {
      price: "asc",
    },
  });

  if (rates.length === 0) {
    // No rates found, return default worldwide rate
    const defaultRates = await prisma.shippingRate.findMany({
      where: {
        country: "WORLDWIDE",
        active: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return defaultRates.map((rate) => ({
      id: rate.id,
      name: rate.name,
      description: rate.description,
      price: Number(rate.price),
      currency: rate.currency,
      estimatedDays: rate.estimatedDays,
    }));
  }

  return rates.map((rate) => ({
    id: rate.id,
    name: rate.name,
    description: rate.description,
    price: Number(rate.price),
    currency: rate.currency,
    estimatedDays: rate.estimatedDays,
  }));
}

/**
 * Calculate total weight of cart items
 */
export async function calculateCartWeight(cartId: string): Promise<number> {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: true,
    },
  });

  let totalWeight = 0;

  for (const item of cartItems) {
    const productWeight = Number(item.product.weight || 0);
    totalWeight += productWeight * item.quantity;
  }

  return totalWeight;
}

/**
 * Get shipping rate by ID
 */
export async function getShippingRate(rateId: string) {
  return await prisma.shippingRate.findUnique({
    where: { id: rateId },
  });
}

/**
 * Validate shipping method for country and weight
 */
export async function validateShippingMethod(
  country: string,
  weight: number,
  shippingMethod: string
): Promise<boolean> {
  const rate = await prisma.shippingRate.findFirst({
    where: {
      name: shippingMethod,
      country: {
        in: [country, "WORLDWIDE"],
      },
      minWeight: {
        lte: weight,
      },
      maxWeight: {
        gte: weight,
      },
      active: true,
    },
  });

  return rate !== null;
}

/**
 * Get all available shipping methods
 */
export async function getAvailableShippingMethods(): Promise<
  Array<{
    name: string;
    description: string | null;
    countries: string[];
  }>
> {
  const rates = await prisma.shippingRate.findMany({
    where: {
      active: true,
    },
    distinct: ["name"],
    select: {
      name: true,
      description: true,
      country: true,
    },
  });

  // Group by shipping method name
  const methodsMap = new Map<
    string,
    { description: string | null; countries: Set<string> }
  >();

  for (const rate of rates) {
    if (!methodsMap.has(rate.name)) {
      methodsMap.set(rate.name, {
        description: rate.description,
        countries: new Set(),
      });
    }
    methodsMap.get(rate.name)!.countries.add(rate.country);
  }

  return Array.from(methodsMap.entries()).map(([name, data]) => ({
    name,
    description: data.description,
    countries: Array.from(data.countries),
  }));
}
