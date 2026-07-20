import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { ids } = await request.json();
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "Invalid or empty IDs list" }, { status: 400 });
        }

        await prisma.contact.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Bulk delete contacts error:", error);
        return NextResponse.json({ error: "Failed to delete contacts" }, { status: 500 });
    }
}
