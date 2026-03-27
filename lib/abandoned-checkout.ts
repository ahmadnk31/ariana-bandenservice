import { prisma } from '@/lib/db';
import { sendAbandonedCheckoutEmail } from '@/lib/email';

/**
 * Process pending abandoned checkout emails.
 * Fetches fresh product data from the database so emails always
 * show up-to-date names, prices, and images.
 * Called as a fire-and-forget side-effect from various API routes
 * so we don't need paid cron jobs.
 */
export async function processPendingAbandonedEmails() {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pending = await prisma.abandonedCheckout.findMany({
            where: {
                emailSent: false,
                recovered: false,
                updatedAt: {
                    lte: fiveMinutesAgo,
                    gte: twentyFourHoursAgo,
                },
            },
            take: 5,
        });

        for (const checkout of pending) {
            try {
                const savedItems: { id?: string; name?: string; size?: string; price?: number; quantity: number; image?: string }[] =
                    typeof checkout.cartItems === 'string'
                        ? JSON.parse(checkout.cartItems)
                        : (checkout.cartItems as typeof savedItems);

                let cartItems: { name: string; size?: string; price: number; quantity: number; image?: string }[];
                let subtotal: number;

                // Check if items have tire IDs (new format) → fetch fresh data from DB
                const tireIds = savedItems.map(i => i.id).filter(Boolean) as string[];

                if (tireIds.length > 0) {
                    const tires = await prisma.tire.findMany({
                        where: { id: { in: tireIds } },
                        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
                    });

                    cartItems = savedItems
                        .map(saved => {
                            const tire = tires.find(t => t.id === saved.id);
                            if (!tire) return null;
                            return {
                                name: tire.name,
                                size: tire.size,
                                price: tire.price,
                                quantity: saved.quantity,
                                image: tire.images[0]?.url,
                            };
                        })
                        .filter((item): item is NonNullable<typeof item> => item !== null);

                    subtotal = cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity, 0
                    );
                } else {
                    // Old format: items already have name, price, etc.
                    cartItems = savedItems
                        .filter(i => i.name && i.price)
                        .map(i => ({
                            name: i.name!,
                            size: i.size,
                            price: i.price!,
                            quantity: i.quantity,
                            image: i.image,
                        }));

                    subtotal = checkout.subtotal || cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity, 0
                    );
                }

                if (cartItems.length === 0) continue;

                const result = await sendAbandonedCheckoutEmail({
                    email: checkout.email,
                    firstName: checkout.firstName,
                    checkoutId: checkout.id,
                    cartItems,
                    subtotal,
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
