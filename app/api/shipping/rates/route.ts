import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/shipping';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || 'BE';
    const tireCount = parseInt(searchParams.get('tireCount') || '1', 10) || 1;

    const rates = getShippingRates(country, tireCount);

    return NextResponse.json({ rates });
}
