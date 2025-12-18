
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
        const tires = await prisma.tire.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { brand: { contains: query, mode: "insensitive" } },
                    { size: { contains: query, mode: "insensitive" } },
                ],
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
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
