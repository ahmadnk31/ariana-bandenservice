import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cartItems, shippingOption, shippingAddress } = body;

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

        const session = await createCheckoutSession({
            cartItems,
            shippingOption,
            shippingAddress,
            successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${origin}/checkout/cancel`,
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
