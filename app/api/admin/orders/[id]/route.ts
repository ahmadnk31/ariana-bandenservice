import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderStatusUpdateEmail } from '@/lib/email';

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

        const statusChanged = !!status && status !== existingOrder.status;
        if (statusChanged) {
            const customerName = order.shippingAddress
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
                : 'Klant';

            const emailResult = await sendOrderStatusUpdateEmail({
                email: order.email,
                customerName,
                orderNumber: order.orderNumber,
                status: order.status,
                trackingNumber: order.trackingNumber,
            });

            if (!emailResult.success) {
                console.error('Order updated but status email failed:', emailResult.error);
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
