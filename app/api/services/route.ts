
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, description, price, duration, active } = body;

        if (!name || !description) {
            return NextResponse.json({ error: "Name and Description are required" }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: {
                name,
                description,
                price: price || null,
                duration: duration || null,
                active: active !== undefined ? active : true,
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error("Failed to create service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
