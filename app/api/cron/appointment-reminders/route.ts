import { NextRequest, NextResponse } from "next/server";
import { processUpcomingAppointmentReminders } from "@/lib/appointment-reminders";

/**
 * Cron endpoint to process upcoming appointment reminders.
 * Called by cron-job.org every hour.
 * Secured with a secret token via Authorization header or query param.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.cron_job_secret;

    // Check Authorization header first, then query param
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    const provided = authHeader?.replace('Bearer ', '') || querySecret;

    if (!secret || provided !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const stats = await processUpcomingAppointmentReminders();
        return NextResponse.json({ 
            success: true, 
            timestamp: new Date().toISOString(),
            ...stats 
        });
    } catch (error) {
        console.error("Cron appointment-reminders error:", error);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
}
