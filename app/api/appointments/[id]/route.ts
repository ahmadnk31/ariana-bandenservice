import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseISO, isBefore } from "date-fns";
import { sendAppointmentCancelledEmail, sendAppointmentRescheduledEmail, sendAppointmentStatusUpdateEmail } from "@/lib/email";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        // Find appointment
        const existing = await prisma.appointment.findUnique({ where: { id } });
        
        if (!existing) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        
        // Hard delete for admin cleanup
        await prisma.appointment.delete({
            where: { id }
        });

        // Send email to Customer & Admin
        try {
            await sendAppointmentCancelledEmail({
                email: existing.email,
                customerName: `${existing.firstName} ${existing.lastName}`,
                date: existing.date,
                cancelledBy: "admin"
            });
        } catch (emailError) {
            console.error("Failed to send cancellation email:", emailError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to cancel appointment:", error);
        return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        if (!data.date) {
            return NextResponse.json({ error: "New date is required" }, { status: 400 });
        }

        const requestedDate = parseISO(data.date);
        
        // Prevent booking in the past
        if (isBefore(requestedDate, new Date())) {
            return NextResponse.json(
                { error: "Cannot book an appointment in the past" },
                { status: 400 }
            );
        }

        // Verify the appointment exists
        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        // Concurrency check: Ensure the requested slot is not booked by someone ELSE
        const existingConflict = await prisma.appointment.findFirst({
            where: {
                date: requestedDate,
                status: {
                    not: "cancelled"
                },
                id: {
                    not: id // Exclude the current appointment
                }
            }
        });

        if (existingConflict) {
            return NextResponse.json(
                { error: "This time slot is no longer available. Please select another time." },
                { status: 409 }
            );
        }

        // Update the appointment
        const updated = await prisma.appointment.update({
            where: { id },
            data: { 
                date: requestedDate,
                status: "pending" // Mark as active again if it was cancelled
            }
        });

        // Send email to Customer & Admin
        try {
            await sendAppointmentRescheduledEmail({
                email: existing.email,
                customerName: `${existing.firstName} ${existing.lastName}`,
                oldDate: existing.date,
                newDate: requestedDate,
                appointmentId: id
            });
        } catch (emailError) {
            console.error("Failed to send rescheduled email:", emailError);
        }

        return NextResponse.json({ success: true, appointment: updated });
    } catch (error) {
        console.error("Failed to reschedule appointment:", error);
        return NextResponse.json({ error: "Failed to reschedule appointment" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status }
        });

        // Send email if confirmed or cancelled by admin
        if (status === "confirmed" || status === "cancelled") {
            try {
                await sendAppointmentStatusUpdateEmail({
                    email: appointment.email,
                    customerName: `${appointment.firstName} ${appointment.lastName}`,
                    status: status as any,
                    date: appointment.date
                });
            } catch (emailError) {
                console.error("Failed to send status update email:", emailError);
            }
        }

        return NextResponse.json({ success: true, appointment });
    } catch (error) {
        console.error("Failed to update appointment status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
