import { NextRequest, NextResponse } from "next/server";
import { validatePassword, createSession, logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { password, action } = await request.json();

        if (action === "logout") {
            await logout();
            return NextResponse.json({ success: true });
        }

        const isValid = await validatePassword(password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }

        await createSession();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 500 }
        );
    }
}
