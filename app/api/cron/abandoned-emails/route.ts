import { NextRequest, NextResponse } from 'next/server';
import { processPendingAbandonedEmails } from '@/lib/abandoned-checkout';

/**
 * Cron endpoint to process abandoned checkout recovery emails.
 * Called by cron-job.org every 5 minutes.
 * Secured with a secret token via Authorization header or query param.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.cron_job_secret;

    // Check Authorization header first, then query param
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    const provided = authHeader?.replace('Bearer ', '') || querySecret;

    if (!secret || provided !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const stats = await processPendingAbandonedEmails();
        return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), ...stats });
    } catch (error) {
        console.error('Cron abandoned-emails error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
}
