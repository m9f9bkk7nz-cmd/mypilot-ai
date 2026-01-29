/**
 * 货币转换 API
 * GET /api/currency/convert - 转换价格
 */

import { NextRequest, NextResponse } from 'next/server';
import { convertPrice, isValidCurrency, type CurrencyCode } from '@/lib/currency';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const amount = parseFloat(searchParams.get('amount') || '0');
    const from = searchParams.get('from') || 'USD';
    const to = searchParams.get('to') || 'USD';

    // 验证参数
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!isValidCurrency(from) || !isValidCurrency(to)) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      );
    }

    // 转换价格
    const convertedAmount = await convertPrice(
      amount,
      from as CurrencyCode,
      to as CurrencyCode
    );

    return NextResponse.json({
      success: true,
      data: {
        amount,
        from,
        to,
        convertedAmount,
      },
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
}
