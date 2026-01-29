/**
 * 汇率 API
 * GET /api/currency/rates - 获取汇率数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates, isValidCurrency, DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/currency';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const base = searchParams.get('base') || DEFAULT_CURRENCY;

    // 验证货币代码
    if (!isValidCurrency(base)) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      );
    }

    // 获取汇率
    const rates = await getExchangeRates(base as CurrencyCode);

    return NextResponse.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
