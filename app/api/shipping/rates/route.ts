import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/shipping';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || 'BE';

    const rates = getShippingRates(country);

    return NextResponse.json({ rates });
}
