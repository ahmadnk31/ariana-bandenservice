import { prisma } from '@/lib/db';
import { sendAbandonedCheckoutEmail } from '@/lib/email';

/**
 * Process pending abandoned checkout emails.
 * Called as a fire-and-forget side-effect from various API routes
 * so we don't need paid cron jobs.
 */
export async function processPendingAbandonedEmails() {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pending = await prisma.abandonedCheckout.findMany({
            where: {
                emailSent: false,
                recovered: false,
                updatedAt: {
                    lte: thirtyMinutesAgo,
                    gte: twentyFourHoursAgo,
                },
            },
            take: 5,
        });

        for (const checkout of pending) {
            try {
                const cartItems = typeof checkout.cartItems === 'string'
                    ? JSON.parse(checkout.cartItems)
                    : checkout.cartItems;

                const result = await sendAbandonedCheckoutEmail({
                    email: checkout.email,
                    firstName: checkout.firstName,
                    cartItems,
                    subtotal: checkout.subtotal,
                });

                if (result.success) {
                    await prisma.abandonedCheckout.update({
                        where: { id: checkout.id },
                        data: { emailSent: true, emailSentAt: new Date() },
                    });
                }
            } catch (err) {
                console.error(`Failed to send abandoned email ${checkout.id}:`, err);
            }
        }
    } catch (err) {
        console.error('processPendingAbandonedEmails error:', err);
    }
}
