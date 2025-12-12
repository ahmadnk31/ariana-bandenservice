import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save to database
        try {
            await prisma.contact.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone || null,
                    service: data.service || null,
                    message: data.message,
                    status: "unread"
                }
            });
        } catch (dbError) {
            console.error("Failed to save contact to DB:", dbError);
            // We continue to send email even if DB save fails, or should we fail?
            // Let's log it but try to send email so we don't lose the lead.
        }

        const result = await sendContactEmail(data);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
