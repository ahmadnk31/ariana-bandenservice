
import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail, sendContactConfirmationEmail } from "@/lib/email";

import { prisma } from "@/lib/db";

// Memory-based rate limiting (simple implementation for basic spam protection)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS = 3;

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const now = Date.now();
        
        // Rate limiting check
        const limitData = rateLimitMap.get(ip);
        if (limitData && now - limitData.lastReset < RATE_LIMIT_WINDOW) {
            if (limitData.count >= MAX_SUBMISSIONS) {
                return NextResponse.json(
                    { error: "Too many submissions. Please try again in 15 minutes." },
                    { status: 429 }
                );
            }
            limitData.count++;
        } else {
            rateLimitMap.set(ip, { count: 1, lastReset: now });
        }

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

        // Send confirmation email to customer
        try {
            await sendContactConfirmationEmail(data);
        } catch (confirmError) {
            console.error("Failed to send contact confirmation email:", confirmError);
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
