import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeInstance;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface ShippingOption {
    carrier: 'pickup' | 'dhl' | 'gls';
    method: 'pickup' | 'standard' | 'express';
    name: string;
    price: number;
    deliveryDays: string;
}

export async function createCheckoutSession({
    cartItems,
    shippingOption,
    shippingAddress,
    successUrl,
    cancelUrl,
}: {
    cartItems: CartItem[];
    shippingOption: ShippingOption;
    shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    successUrl: string;
    cancelUrl: string;
}) {
    const stripe = getStripe();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(item => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: item.name,
                images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
    }));

    // Add shipping as a line item
    lineItems.push({
        price_data: {
            currency: 'eur',
            product_data: {
                name: `Shipping (${shippingOption.carrier.toUpperCase()} ${shippingOption.method})`,
            },
            unit_amount: Math.round(shippingOption.price * 100),
        },
        quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'ideal', 'bancontact'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: shippingAddress.email,
        metadata: {
            cartItems: JSON.stringify(cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            }))),
            shippingCarrier: shippingOption.carrier,
            shippingMethod: shippingOption.method,
            shippingCost: shippingOption.price.toString(),
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            phone: shippingAddress.phone || '',
            street: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
        },
    });

    return session;
}

export async function retrieveSession(sessionId: string) {
    const stripe = getStripe();
    return stripe.checkout.sessions.retrieve(sessionId);
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    const stripe = getStripe();
    return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
