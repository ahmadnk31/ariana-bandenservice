import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendStockRequestEmail, sendStockRequestConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tireId, email, name, phone } = body;

        if (!tireId || !email) {
            return NextResponse.json(
                { error: "Tire ID and Email are required" },
                { status: 400 }
            );
        }

        // Check if tire exists
        const tire = await prisma.tire.findUnique({
            where: { id: tireId }
        });

        if (!tire) {
            return NextResponse.json(
                { error: "Tire not found" },
                { status: 404 }
            );
        }

        const stockRequest = await prisma.stockRequest.create({
            data: {
                tireId,
                email,
                name,
                phone,
                status: "pending"
            }
        });

        // Send email notification to admin using Resend
        try {
            await sendStockRequestEmail({
                tireName: tire.name,
                email,
                name,
                phone
            });
        } catch (emailError) {
            console.error("Failed to send stock request email:", emailError);
            // We don't fail the request if the email fails, as the request is saved in DB
        }

        // Send confirmation email to user
        try {
            await sendStockRequestConfirmationEmail({
                tireName: tire.name,
                email,
                name,
                phone
            });
        } catch (confirmError) {
            console.error("Failed to send customer confirmation email:", confirmError);
        }

        return NextResponse.json({ success: true, data: stockRequest });
    } catch (error) {
        console.error("Stock request error:", error);
        return NextResponse.json(
            { error: "Failed to submit stock request" },
            { status: 500 }
        );
    }
}
