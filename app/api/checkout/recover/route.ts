import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/checkout/recover?id=xxx
// Returns cart items with fresh tire data so the checkout page can restore the cart
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    try {
        const checkout = await prisma.abandonedCheckout.findUnique({
            where: { id },
        });

        if (!checkout) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Parse saved cart items
        const savedItems: { id?: string; name?: string; size?: string; price?: number; quantity: number; image?: string }[] =
            typeof checkout.cartItems === 'string'
                ? JSON.parse(checkout.cartItems)
                : (checkout.cartItems as typeof savedItems);

        const tireIds = savedItems.map(i => i.id).filter(Boolean) as string[];

        if (tireIds.length === 0) {
            return NextResponse.json({ error: 'No tire IDs found' }, { status: 404 });
        }

        // Fetch fresh tire data
        const tires = await prisma.tire.findMany({
            where: { id: { in: tireIds } },
            include: { images: { orderBy: { order: 'asc' }, take: 1 } },
        });

        const cartItems = savedItems
            .map(saved => {
                const tire = tires.find(t => t.id === saved.id);
                if (!tire) return null;
                return {
                    id: tire.id,
                    name: tire.name,
                    slug: tire.slug,
                    brand: tire.brand,
                    size: tire.size,
                    price: tire.price,
                    quantity: saved.quantity,
                    image: tire.images[0]?.url || undefined,
                    stock: tire.stock,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        return NextResponse.json({
            cartItems,
            formData: {
                firstName: checkout.firstName || '',
                lastName: checkout.lastName || '',
                email: checkout.email,
                phone: checkout.phone || '',
                street: checkout.street || '',
                city: checkout.city || '',
                postalCode: checkout.postalCode || '',
                country: checkout.country || 'BE',
            },
        });
    } catch (error) {
        console.error('Failed to recover checkout:', error);
        return NextResponse.json({ error: 'Failed to recover' }, { status: 500 });
    }
}
