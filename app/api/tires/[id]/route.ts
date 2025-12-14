import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { deleteImage } from "@/lib/s3";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tire = await prisma.tire.findUnique({
            where: { id },
            include: { images: { orderBy: { order: "asc" } } },
        });

        if (!tire) {
            return NextResponse.json({ error: "Tire not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...tire,
            features: JSON.parse(tire.features),
        });
    } catch (error) {
        console.error("Failed to fetch tire:", error);
        return NextResponse.json(
            { error: "Failed to fetch tire" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const data = await request.json();

        // Get existing images to compare
        const existingTire = await prisma.tire.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!existingTire) {
            return NextResponse.json({ error: "Tire not found" }, { status: 404 });
        }

        // Find images to delete (ones that are in existing but not in new data)
        const newImageKeys = new Set(data.images?.map((img: { key: string }) => img.key) || []);
        const imagesToDelete = existingTire.images.filter((img) => !newImageKeys.has(img.key));

        // Delete removed images from S3
        for (const img of imagesToDelete) {
            try {
                await deleteImage(img.key);
            } catch (e) {
                console.error("Failed to delete image from S3:", e);
            }
        }

        // Delete all existing images from DB and recreate
        await prisma.tireImage.deleteMany({ where: { tireId: id } });

        const tire = await prisma.tire.update({
            where: { id },
            data: {
                name: data.name,
                brand: data.brand,
                season: data.season,
                condition: data.condition,
                size: data.size,
                width: data.width || null,
                aspectRatio: data.aspectRatio || null,
                rimSize: data.rimSize || null,
                loadIndex: data.loadIndex || null,
                speedRating: data.speedRating || null,
                dot: data.dot || null,
                price: data.price,
                description: data.description || null,
                stock: data.stock || 0,
                inStock: data.inStock ?? true,
                features: JSON.stringify(data.features),
                images: {
                    create: data.images?.map((img: { url: string; key: string }, index: number) => ({
                        url: img.url,
                        key: img.key,
                        order: index,
                    })) || [],
                },
            },
            include: { images: true },
        });

        return NextResponse.json(tire);
    } catch (error) {
        console.error("Failed to update tire:", error);
        return NextResponse.json(
            { error: "Failed to update tire" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // 1. First try to delete from DB (this validates constraints like foreign keys)
        // We include images so we know which keys to delete from S3 afterwards
        const deletedTire = await prisma.tire.delete({
            where: { id },
            include: { images: true },
        });

        // 2. If DB delete succeeded, now we can safely delete from S3
        // We run these in parallel and don't block the response deeply, 
        // though we await them to ensure we log errors.
        const deletePromises = deletedTire.images.map(async (img) => {
            try {
                await deleteImage(img.key);
            } catch (e) {
                console.error(`Failed to delete image ${img.key} from S3:`, e);
                // We don't throw here to ensure other cleanup continues
            }
        });

        await Promise.all(deletePromises);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete tire:", error);

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: "Cannot delete tire because it is associated with existing orders. Please verify your data." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete tire" },
            { status: 500 }
        );
    }
}
