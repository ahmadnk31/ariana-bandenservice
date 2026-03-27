import { NextResponse } from 'next/server';
import { processPendingAbandonedEmails } from '@/lib/abandoned-checkout';

// Lightweight endpoint called by the client-side heartbeat
// to process any pending abandoned checkout emails
export async function GET() {
    // Fire-and-forget — don't block the response
    processPendingAbandonedEmails();
    return NextResponse.json({ ok: true });
}
