import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { sendContactReplyEmail } from "@/lib/email";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { message } = await request.json();

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    try {
        const contact = await prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        // Send Email
        const result = await sendContactReplyEmail({
            customerName: contact.firstName,
            customerEmail: contact.email,
            adminMessage: message,
            originalMessage: contact.message,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // Update DB
        await prisma.contact.update({
            where: { id },
            data: {
                status: "replied",
                replyMessage: message,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reply error:", error);
        return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
    }
}
