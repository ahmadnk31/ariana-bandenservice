import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addHours } from "date-fns";
import { sendAppointmentReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
    // Basic Security: Protect route so it can only be run by the Vercel Cron system
    // The Vercel platform strictly enforces the Bearer token based on the environment variable
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Only enforce security if CRON_SECRET is actually configured in the environment.
    // If not configured, we allow it to run freely for local testing.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // We look for any future appointment that is occurring within the next 24 hours
        // Wait, why not exactly 24 hours? 
        // Because if the cron misses a beat, finding anything "less than 24 hours away" is extremely robust.
        const now = new Date();
        const tomorrow = addHours(now, 24);

        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                status: "pending", // active uncancelled appointments
                reminderSent: false,
                date: {
                    gt: now,
                    lte: tomorrow // less than or exactly 24 hours from right now
                }
            }
        });

        if (upcomingAppointments.length === 0) {
            return NextResponse.json({ success: true, message: "No reminders to send" });
        }

        const sentReminders = [];

        for (const appointment of upcomingAppointments) {
            try {
                // Instantly lock the DB row to prevent double-sending in case of concurrency
                await prisma.appointment.update({
                    where: { id: appointment.id },
                    data: { reminderSent: true }
                });

                // Dispatch Email
                await sendAppointmentReminderEmail({
                    email: appointment.email,
                    customerName: `${appointment.firstName} ${appointment.lastName}`,
                    date: appointment.date,
                    appointmentId: appointment.id
                });

                sentReminders.push(appointment.id);
            } catch (err) {
                console.error(`Failed to send reminder for ${appointment.id}:`, err);
                
                // If the email hard failed, rollback the reminder status so it can try again next hour
                await prisma.appointment.update({
                    where: { id: appointment.id },
                    data: { reminderSent: false }
                });
            }
        }

        return NextResponse.json({ 
            success: true, 
            sentCount: sentReminders.length,
            appointmentIds: sentReminders 
        });

    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
