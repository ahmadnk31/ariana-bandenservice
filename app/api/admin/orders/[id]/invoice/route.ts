import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInvoicePdf } from '@/lib/invoice';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch full order details for invoice
        const orderWithDetails = await prisma.order.findUnique({
            where: { id },
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

        if (!orderWithDetails) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!orderWithDetails.shippingAddress) {
            return NextResponse.json({ error: 'Shipping address missing' }, { status: 400 });
        }

        const customerName = `${orderWithDetails.shippingAddress.firstName} ${orderWithDetails.shippingAddress.lastName}`.trim() || 'Klant';
        const emailItems = orderWithDetails.items.map(item => ({
            name: `${item.tire?.name || 'Band'}${item.withMounting ? ' (Incl. Montage)' : ''}`,
            size: item.tire?.size || undefined,
            quantity: item.quantity,
            unitPrice: item.price + (item.withMounting ? 19.85 : 0),
        }));

        // Generate Invoice PDF
        const invoicePdf = await generateInvoicePdf({
            invoiceNumber: `INV-${orderWithDetails.orderNumber}`,
            issueDate: orderWithDetails.createdAt, // Use order creation date
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
            items: emailItems,
            subtotal: orderWithDetails.subtotal,
            shippingCost: orderWithDetails.shippingCost,
            paymentFee: orderWithDetails.paymentFee,
            total: orderWithDetails.total,
        });

        // Return the PDF as a downloadable/viewable file
        return new Response(new Uint8Array(invoicePdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="factuur-${orderWithDetails.orderNumber}.pdf"`,
            },
        });
    } catch (error) {
        console.error('[Admin Invoice API] Error:', error);
        return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
    }
}
