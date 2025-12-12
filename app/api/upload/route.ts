import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/s3";

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const { url, key } = await uploadImage(buffer, file.name, file.type);

        return NextResponse.json({ url, key });
    } catch (error) {
        console.error("Failed to upload image:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
