import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseISO, isBefore } from "date-fns";
import { sendAppointmentCancelledEmail, sendAppointmentRescheduledEmail } from "@/lib/email";

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
        
        // We set status to cancelled instead of hard deleting
        await prisma.appointment.update({
            where: { id },
            data: { status: "cancelled" }
        });

        // Send email to Customer & Admin
        try {
            await sendAppointmentCancelledEmail({
                email: existing.email,
                customerName: `${existing.firstName} ${existing.lastName}`,
                date: existing.date,
                cancelledBy: "customer"
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
