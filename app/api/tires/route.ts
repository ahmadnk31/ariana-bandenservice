import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
    try {
        const tires = await prisma.tire.findMany({
            include: { images: { orderBy: { order: "asc" } } },
            orderBy: { createdAt: "desc" },
        });

        // Parse features JSON string back to array
        const tiresWithParsedFeatures = tires.map((tire) => ({
            ...tire,
            features: JSON.parse(tire.features),
        }));

        return NextResponse.json(tiresWithParsedFeatures);
    } catch (error) {
        console.error("Failed to fetch tires:", error);
        return NextResponse.json(
            { error: "Failed to fetch tires" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Generate base slug from details
        let baseSlug = `${data.brand}-${data.name}-${data.size}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Ensure uniqueness
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.tire.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const tire = await prisma.tire.create({
            data: {
                name: data.name,
                slug,
                brand: data.brand,
                season: data.season,
                condition: data.condition || "new",
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

        return NextResponse.json(tire, { status: 201 });
    } catch (error) {
        console.error("Failed to create tire:", error);
        return NextResponse.json(
            { error: "Failed to create tire" },
            { status: 500 }
        );
    }
}
