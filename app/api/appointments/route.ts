import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseISO, isBefore } from "date-fns";
import { sendNewAppointmentAdminEmail, sendAppointmentConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const requestedDate = parseISO(data.date);
        
        // Prevent booking in the past
        if (isBefore(requestedDate, new Date())) {
            return NextResponse.json(
                { error: "Cannot book an appointment in the past" },
                { status: 400 }
            );
        }

        // Security Hardening: Validate tireId if provided (Anti-Enumeration/Integrity)
        if (data.tireId) {
            const tireExists = await prisma.tire.findUnique({
                where: { id: data.tireId },
                select: { id: true }
            });
            if (!tireExists) {
                return NextResponse.json(
                    { error: "Invalid tire selection" },
                    { status: 400 }
                );
            }
        }

        // Check if the slot is already booked (Concurrency Check)
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: requestedDate,
                status: {
                    not: "cancelled"
                }
            }
        });

        if (existingAppointment) {
            return NextResponse.json(
                { error: "This time slot is no longer available. Please select another time." },
                { status: 409 } // Conflict
            );
        }

        // Save to database
        const appointment = await prisma.appointment.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone || "",
                tireId: data.tireId || null,
                tireName: data.tireName || null,
                date: requestedDate,
                notes: data.notes || null,
                status: "pending"
            }
        });

        // Send email notification to admin using the dedicated appointment template
        try {
            await sendNewAppointmentAdminEmail({
                customerName: `${data.firstName} ${data.lastName}`,
                customerEmail: data.email,
                customerPhone: data.phone,
                tireName: data.tireName || null,
                date: requestedDate,
                notes: data.notes || null
            });

            // Send confirmation email to the customer with management link
            await sendAppointmentConfirmationEmail({
                email: data.email,
                firstName: data.firstName,
                appointmentId: appointment.id,
                date: requestedDate,
                tireName: data.tireName || null
            });
        } catch (emailError) {
            console.error("Failed to send appointment emails:", emailError);
            // Don't fail the request if email fails, appointment is saved
        }

        return NextResponse.json({ success: true, appointment });
    } catch (error) {
        console.error("Appointment booking error:", error);
        return NextResponse.json(
            { error: "Failed to book appointment" },
            { status: 500 }
        );
    }
}
