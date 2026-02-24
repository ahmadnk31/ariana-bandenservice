import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { generateOrderNumber } from '@/lib/shipping';
import { generateInvoicePdf } from '@/lib/invoice';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    console.log('🔔 Webhook received!');

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log('Signature:', signature ? 'present' : 'missing');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        );
    }

    let event;
    try {
        event = constructWebhookEvent(body, signature);
        console.log('✅ Event type:', event.type);
    } catch (error) {
        console.error('❌ Webhook signature verification failed:', error);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    if (event.type === 'checkout.session.completed') {
        console.log('🛒 Processing checkout.session.completed');
        const session = event.data.object;
        console.log('Session metadata:', session.metadata);

        try {
            const metadata = session.metadata || {};
            const cartItems = JSON.parse(metadata.cartItems || '[]');

            // Calculate subtotal from cart items
            const subtotal = cartItems.reduce(
                (sum: number, item: { price: number; quantity: number }) =>
                    sum + item.price * item.quantity,
                0
            );
            const shippingCost = parseFloat(metadata.shippingCost || '0');
            const total = subtotal + shippingCost;

            // Create order
            const order = await prisma.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    status: 'paid',
                    email: session.customer_email || metadata.email || '',
                    phone: metadata.phone || null,
                    shippingCarrier: metadata.shippingCarrier || null,
                    shippingMethod: metadata.shippingMethod || null,
                    shippingCost,
                    stripeSessionId: session.id,
                    stripePaymentId: session.payment_intent as string || null,
                    subtotal,
                    total,
                    shippingAddress: {
                        create: {
                            firstName: metadata.firstName || '',
                            lastName: metadata.lastName || '',
                            street: metadata.street || '',
                            city: metadata.city || '',
                            postalCode: metadata.postalCode || '',
                            country: metadata.country || 'BE',
                        },
                    },
                    items: {
                        create: cartItems.map((item: { id: string; quantity: number; price: number }) => ({
                            tireId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            // Update tire stock
            for (const item of cartItems) {
                await prisma.tire.update({
                    where: { id: item.id },
                    data: {
                        stock: { decrement: item.quantity },
                    },
                });
            }

            console.log('Order created:', order.orderNumber);

            // Mark abandoned checkout as completed to stop reminders
            const abandonedCheckoutId = metadata.abandonedCheckoutId || null;
            const customerEmail = session.customer_email || metadata.email;
            console.log('[webhook] Completing abandoned checkout:', { abandonedCheckoutId, customerEmail });

            if (abandonedCheckoutId) {
                await prisma.abandonedCheckout.update({
                    where: { id: abandonedCheckoutId },
                    data: {
                        recovered: true,
                        emailSent: true,
                        emailSentAt: new Date(),
                    },
                });
                console.log('[webhook] Abandoned checkout marked completed by id');
            } else if (customerEmail) {
                const result = await prisma.abandonedCheckout.updateMany({
                    where: {
                        email: customerEmail,
                        recovered: false,
                    },
                    data: {
                        recovered: true,
                        emailSent: true,
                        emailSentAt: new Date(),
                    },
                });
                console.log('[webhook] Abandoned checkouts marked completed by email:', result.count);
            }

            const orderWithDetails = await prisma.order.findUnique({
                where: { id: order.id },
                include: {
                    shippingAddress: true,
                    items: {
                        include: {
                            tire: {
                                select: {
                                    name: true,
                                    size: true,
                                },
                            },
                        },
                    },
                },
            });

            if (orderWithDetails && orderWithDetails.shippingAddress) {
                const customerName = `${orderWithDetails.shippingAddress.firstName} ${orderWithDetails.shippingAddress.lastName}`.trim() || 'Klant';
                const invoicePdf = await generateInvoicePdf({
                    invoiceNumber: `INV-${orderWithDetails.orderNumber}`,
                    issueDate: new Date(),
                    orderNumber: orderWithDetails.orderNumber,
                    customerName,
                    customerEmail: orderWithDetails.email,
                    customerPhone: orderWithDetails.phone,
                    shippingAddress: {
                        street: orderWithDetails.shippingAddress.street,
                        city: orderWithDetails.shippingAddress.city,
                        postalCode: orderWithDetails.shippingAddress.postalCode,
                        country: orderWithDetails.shippingAddress.country,
                    },
                    items: orderWithDetails.items.map(item => ({
                        name: item.tire?.name || 'Band',
                        size: item.tire?.size || undefined,
                        quantity: item.quantity,
                        unitPrice: item.price,
                    })),
                    subtotal: orderWithDetails.subtotal,
                    shippingCost: orderWithDetails.shippingCost,
                    total: orderWithDetails.total,
                });

                const confirmationResult = await sendOrderConfirmationEmail({
                    email: orderWithDetails.email,
                    customerName,
                    orderNumber: orderWithDetails.orderNumber,
                    items: orderWithDetails.items.map(item => ({
                        name: item.tire?.name || 'Band',
                        size: item.tire?.size || undefined,
                        quantity: item.quantity,
                        unitPrice: item.price,
                    })),
                    subtotal: orderWithDetails.subtotal,
                    shippingCost: orderWithDetails.shippingCost,
                    total: orderWithDetails.total,
                    invoicePdf,
                });

                if (!confirmationResult.success) {
                    console.error('[webhook] Failed to send confirmation/invoice email:', confirmationResult.error);
                }
            }
        } catch (error) {
            console.error('Failed to create order:', error);
            return NextResponse.json(
                { error: 'Failed to process order' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}
