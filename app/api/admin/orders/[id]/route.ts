import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderStatusUpdateEmail, sendOrderConfirmationEmail } from '@/lib/email';
import { generateInvoicePdf } from '@/lib/invoice';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, trackingNumber } = body;

        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: { shippingAddress: true },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        const order = await prisma.order.update({
            where: { id },
            data: {
                status: status || undefined,
                trackingNumber: trackingNumber || undefined,
            },
            include: {
                shippingAddress: true,
            },
        });

        const statusChanged = status !== undefined && status !== existingOrder.status;
        const trackingChanged = trackingNumber !== undefined && trackingNumber !== (existingOrder.trackingNumber || "");

        console.log(`[Order Update] ID: ${id}`);
        console.log(`[Order Update] Incoming - Status: ${status}, Tracking: ${trackingNumber}`);
        console.log(`[Order Update] Current - Status: ${existingOrder.status}, Tracking: ${existingOrder.trackingNumber}`);
        console.log(`[Order Update] Trigger - StatusChanged: ${statusChanged}, TrackingChanged: ${trackingChanged}`);

        if (statusChanged || trackingChanged) {
            const customerName = order.shippingAddress
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
                : 'Klant';

            // SPECIAL CASE: Status changed to 'paid' (manual confirmation of payment/bank transfer)
            // We want to send a full confirmation email with invoice PDF, similar to Stripe checkout
            if (status === 'paid' && existingOrder.status !== 'paid') {
                console.log(`[Order Update] Status changed to PAID. Generating invoice and sending confirmation email...`);
                
                try {
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

                    if (orderWithDetails && orderWithDetails.shippingAddress) {
                        const emailItems = orderWithDetails.items.map(item => ({
                            name: `${item.tire?.name || 'Band'}${item.withMounting ? ' (Incl. Montage)' : ''}`,
                            size: item.tire?.size || undefined,
                            quantity: item.quantity,
                            unitPrice: item.price + (item.withMounting ? 19.85 : 0),
                        }));

                        // Generate Invoice PDF
                        let invoicePdfBase64: string | null = null;
                        try {
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
                                items: emailItems,
                                subtotal: orderWithDetails.subtotal,
                                shippingCost: orderWithDetails.shippingCost,
                                paymentFee: orderWithDetails.paymentFee,
                                total: orderWithDetails.total,
                            });
                            invoicePdfBase64 = invoicePdf.toString('base64');
                        } catch (pdfError) {
                            console.error('[Order Update] PDF generation failed:', pdfError);
                        }

                        // Send confirmation email
                        const confirmationResult = await sendOrderConfirmationEmail({
                            email: orderWithDetails.email,
                            customerName,
                            orderNumber: orderWithDetails.orderNumber,
                            items: emailItems,
                            subtotal: orderWithDetails.subtotal,
                            shippingCost: orderWithDetails.shippingCost,
                            paymentFee: orderWithDetails.paymentFee,
                            total: orderWithDetails.total,
                            invoicePdf: invoicePdfBase64,
                            paymentMethod: orderWithDetails.paymentMethod as any,
                        });

                        if (confirmationResult.success) {
                            console.log(`[Order Update] Confirmation email (paid) sent to ${orderWithDetails.email}`);
                        } else {
                            console.error(`[Order Update] Failed to send confirmation email:`, confirmationResult.error);
                        }
                    }
                } catch (error) {
                    console.error(`[Order Update] Error during paid status transition processing:`, error);
                }
            } else {
                // REGULAR CASE: Status updated (e.g. to 'shipped') or tracking changed
                console.log(`[Order Update] Attempting to send status update email to: ${order.email}`);

                const emailResult = await sendOrderStatusUpdateEmail({
                    email: order.email,
                    customerName,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    trackingNumber: order.trackingNumber,
                });

                if (!emailResult.success) {
                    console.error('[Order Update] Status update email FAILED:', emailResult.error);
                } else {
                    console.log('[Order Update] Status update email SENT SUCCESSFULLY');
                }
            }
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { tire: true },
                },
                shippingAddress: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Failed to fetch order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}
