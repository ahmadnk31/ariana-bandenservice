import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTireSize } from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        const parsedSize = parseTireSize(query);
        const orConditions: any[] = [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { size: { contains: query, mode: "insensitive" } },
        ];

        // If we found size components, add them as an AND condition if they match exactly
        // Wait, if we have a parsed size, we might want to prioritize it or make it an alternative
        if (parsedSize) {
            const sizeFields: any = {};
            if (parsedSize.width) sizeFields.width = parsedSize.width;
            if (parsedSize.aspectRatio) sizeFields.aspectRatio = parsedSize.aspectRatio;
            if (parsedSize.rimSize) sizeFields.rimSize = parsedSize.rimSize;

            orConditions.push(sizeFields);
        }

        const tires = await prisma.tire.findMany({
            where: {
                OR: orConditions,
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                size: true,
                price: true,
                condition: true, // Add condition
                images: {
                    take: 1,
                    orderBy: { order: "asc" },
                    select: { url: true },
                },
            },
        });

        // Transform simplified response
        const results = tires.map(tire => ({
            id: tire.id,
            name: tire.name,
            slug: tire.slug,
            brand: tire.brand,
            size: tire.size,
            condition: tire.condition,
            price: tire.price,
            image: tire.images[0]?.url,
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
