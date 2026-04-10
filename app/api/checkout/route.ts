import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cartItems, shippingOption, shippingAddress, abandonedCheckoutId, paymentMethod = 'stripe' } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        if (!shippingOption) {
            return NextResponse.json(
                { error: 'Shipping option is required' },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingAddress.email) {
            return NextResponse.json(
                { error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Get the origin for success/cancel URLs
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Calculate subtotal
        const subtotal = cartItems.reduce((sum: number, item: any) => {
            const mountingFee = item.withMounting ? 19.85 : 0;
            return sum + (item.price + mountingFee) * item.quantity;
        }, 0);

        // Calculate Stripe fee (1.5% + 0.25) or 0 for bank transfer
        const paymentFee = paymentMethod === 'stripe' ? (subtotal + shippingOption.price) * 0.015 + 0.25 : 0;
        const total = subtotal + shippingOption.price + paymentFee;

        if (paymentMethod === 'bank_transfer') {
            const { prisma } = await import('@/lib/db');
            const { generateOrderNumber } = await import('@/lib/shipping');
            const { sendOrderConfirmationEmail, sendNewOrderAdminEmail } = await import('@/lib/email');

            const orderNumber = generateOrderNumber();

            // Create order in DB
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    status: 'pending_payment',
                    paymentMethod: 'bank_transfer',
                    email: shippingAddress.email,
                    phone: shippingAddress.phone || null,
                    shippingCarrier: shippingOption.carrier,
                    shippingMethod: shippingOption.method,
                    shippingCost: shippingOption.price,
                    paymentFee,
                    subtotal,
                    total,
                    shippingAddress: {
                        create: {
                            firstName: shippingAddress.firstName,
                            lastName: shippingAddress.lastName,
                            street: shippingAddress.street,
                            city: shippingAddress.city,
                            postalCode: shippingAddress.postalCode,
                            country: shippingAddress.country || 'BE',
                        },
                    },
                    items: {
                        create: cartItems.map((item: any) => ({
                            tireId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            withMounting: item.withMounting || false,
                        })),
                    },
                },
            });

            // Update stock
            for (const item of cartItems) {
                await prisma.tire.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Send emails
            const emailItems = cartItems.map((item: any) => ({
                name: item.name + (item.withMounting ? ' (Incl. Montage)' : ''),
                quantity: item.quantity,
                unitPrice: item.price + (item.withMounting ? 19.85 : 0),
            }));

            await sendOrderConfirmationEmail({
                email: shippingAddress.email,
                customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                orderNumber: order.orderNumber,
                items: emailItems,
                subtotal,
                shippingCost: shippingOption.price,
                paymentFee,
                total,
                invoicePdf: null,
                paymentMethod: 'bank_transfer',
            });

            await sendNewOrderAdminEmail({
                orderNumber: order.orderNumber,
                customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                customerEmail: shippingAddress.email,
                customerPhone: shippingAddress.phone,
                total,
                shippingMethod: `${shippingOption.carrier} ${shippingOption.method}`,
                paymentFee,
                invoicePdf: null,
                paymentMethod: 'bank_transfer',
            });

            return NextResponse.json({ 
                url: `${origin}/checkout/success?method=bank_transfer&order=${order.orderNumber}&amount=${total}` 
            });
        }

        const session = await createCheckoutSession({
            cartItems,
            shippingOption,
            shippingAddress,
            paymentFee,
            successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${origin}/checkout/cancel`,
            abandonedCheckoutId,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout session error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
