import { prisma } from '@/lib/db';
import { sendAppointmentReminderEmail } from '@/lib/email';
import { addHours } from 'date-fns';

/**
 * Process upcoming appointment reminders.
 * Finds all appointments scheduled in the next 24 hours that haven't
 * received a reminder yet, and dispatches the reminder email.
 * Called by cron-job.org via /api/cron/appointment-reminders every hour.
 */
export async function processUpcomingAppointmentReminders() {
    const stats = { found: 0, sent: 0, failed: 0, skipped: 0, errors: [] as string[] };
    
    try {
        const now = new Date();
        const tomorrow = addHours(now, 24);

        // Find appointments pending, not yet reminded, occurring within the next 24 hours
        const upcoming = await prisma.appointment.findMany({
            where: {
                status: "pending",
                reminderSent: false,
                date: {
                    gt: now,
                    lte: tomorrow
                }
            },
            take: 20 // Process in batches to avoid timeouts
        });

        stats.found = upcoming.length;
        console.log(`[appointment-reminders] Found ${upcoming.length} upcoming appointments needing reminders`);

        for (const appointment of upcoming) {
            try {
                // Update DB first to prevent double-sending in case of concurrency
                await prisma.appointment.update({
                    where: { id: appointment.id },
                    data: { reminderSent: true }
                });

                const result = await sendAppointmentReminderEmail({
                    email: appointment.email,
                    customerName: `${appointment.firstName} ${appointment.lastName}`,
                    date: appointment.date,
                    appointmentId: appointment.id
                });

                if (result.success) {
                    stats.sent++;
                    console.log(`[appointment-reminders] Reminder sent to ${appointment.email}`);
                } else {
                    // Rollback flag if email failed so we can retry later
                    await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: { reminderSent: false }
                    });
                    stats.failed++;
                    console.log(`[appointment-reminders] Reminder failed for ${appointment.email}`);
                }
            } catch (err) {
                // Rollback flag on hard error too
                await prisma.appointment.update({
                    where: { id: appointment.id },
                    data: { reminderSent: false }
                }).catch(() => {}); // Ignore secondary error

                stats.failed++;
                stats.errors.push(`${appointment.id}: ${err instanceof Error ? err.message : String(err)}`);
                console.error(`Failed to process reminder for ${appointment.id}:`, err);
            }
        }
    } catch (err) {
        stats.errors.push(err instanceof Error ? err.message : String(err));
        console.error('processUpcomingAppointmentReminders error:', err);
    }
    
    return stats;
}
