import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/shipping';
import { processPendingAbandonedEmails } from '@/lib/abandoned-checkout';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || 'BE';
    const tireCount = parseInt(searchParams.get('tireCount') || '1', 10) || 1;

    const rates = getShippingRates(country, tireCount);

    // Fire-and-forget: process any pending abandoned checkout emails on common traffic
    processPendingAbandonedEmails();

    return NextResponse.json({ rates });
}
