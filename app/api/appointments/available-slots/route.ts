import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, addMinutes, isBefore, isSameDay, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get("date");

    if (!dateQuery) {
        return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    try {
        const selectedDate = parseISO(dateQuery);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Closed on Sundays
        if (dayOfWeek === 0) {
            return NextResponse.json({ slots: [] });
        }

        // Define business hours
        const startHour = 9;
        const endHour = dayOfWeek === 6 ? 15 : 18; // Saturday closes at 15:00

        // Fetch all appointments for that day
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay(selectedDate),
                    lte: endOfDay(selectedDate),
                },
                status: {
                    not: "cancelled" // Cancelled appointments free up the slot
                }
            },
            select: { date: true } // We only need the date
        });

        // Convert existing appointments to a Set of ISO strings (down to the minute)
        const bookedSlots = new Set(
            existingAppointments.map(app => app.date.toISOString())
        );

        // Generate all possible 30-minute slots for the given day
        const slots = [];
        let currentSlot = new Date(selectedDate);
        currentSlot.setHours(startHour, 0, 0, 0);

        const endOfBusiness = new Date(selectedDate);
        endOfBusiness.setHours(endHour, 0, 0, 0);

        const now = new Date(); // To prevent booking times that have already passed today

        while (isBefore(currentSlot, endOfBusiness)) {
            // Only add slot if it's in the future and not already booked
            if (isBefore(now, currentSlot) || !isSameDay(now, currentSlot)) {
                if (!bookedSlots.has(currentSlot.toISOString())) {
                    slots.push(currentSlot.toISOString());
                }
            }
            // Add 30 minutes
            currentSlot = addMinutes(currentSlot, 30);
        }

        return NextResponse.json({ slots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
