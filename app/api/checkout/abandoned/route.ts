import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processPendingAbandonedEmails } from '@/lib/abandoned-checkout';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, phone, street, city, postalCode, country, cartItems, subtotal } = body;

        if (!email || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Email and cart items are required' }, { status: 400 });
        }

        // Upsert: update if same email already has an abandoned checkout, otherwise create
        const abandoned = await prisma.abandonedCheckout.upsert({
            where: {
                // Find the most recent non-recovered checkout for this email
                id: (await prisma.abandonedCheckout.findFirst({
                    where: { email, recovered: false },
                    orderBy: { createdAt: 'desc' },
                    select: { id: true },
                }))?.id || 'nonexistent',
            },
            update: {
                firstName,
                lastName,
                phone,
                street,
                city,
                postalCode,
                country: country || 'BE',
                cartItems: JSON.stringify(cartItems),
                subtotal: subtotal || 0,
                emailSent: false, // Reset so a new email can be sent
                updatedAt: new Date(),
            },
            create: {
                email,
                firstName,
                lastName,
                phone,
                street,
                city,
                postalCode,
                country: country || 'BE',
                cartItems: JSON.stringify(cartItems),
                subtotal: subtotal || 0,
            },
        });

        // Fire-and-forget: process any OTHER pending abandoned checkout emails
        processPendingAbandonedEmails();

        return NextResponse.json({ success: true, id: abandoned.id });
    } catch (error) {
        console.error('Failed to save abandoned checkout:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
