import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/db";
import TireFilters from "../../components/TireFilters";
import type { Metadata } from 'next';
import { parseTireSize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    return {
        title: metadata.tiresTitle || "Tires | Ariana Bandenservice",
        description: metadata.tiresDescription || "Browse our selection of premium tires from top brands.",
    };
}

interface TiresPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TiresPage({ searchParams }: TiresPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const itemsPerPage = 2;

    // Filters
    const season = (params.season as string) || "all";
    const condition = (params.condition as string) || "all";
    const search = (params.search as string) || "";
    const brand = (params.brand as string) || "all";
    const minPrice = params.minPrice ? Number(params.minPrice) : null;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

    // Size & Specs
    const width = params.width ? Number(params.width) : null;
    const aspectRatio = params.aspectRatio ? Number(params.aspectRatio) : null;
    const rimSize = params.rimSize ? Number(params.rimSize) : null;
    const loadIndex = (params.loadIndex as string) || "all";
    const speedRating = (params.speedRating as string) || "all";

    // Build where clause based on filter
    const where: any = {};

    // Season filter
    if (season && season !== "all") {
        where.season = season;
    }

    // Condition filter
    if (condition && condition !== "all") {
        where.condition = condition;
    }

    // Brand filter
    if (brand && brand !== "all") {
        const brands = brand.split(",");
        if (brands.length > 0) {
            where.brand = { in: brands, mode: "insensitive" };
        }
    }

    // Price range
    if (minPrice !== null || maxPrice !== null) {
        where.price = {};
        if (minPrice !== null) where.price.gte = minPrice;
        if (maxPrice !== null) where.price.lte = maxPrice;
    }

    // Dimensions
    if (width) where.width = width;
    if (aspectRatio) where.aspectRatio = aspectRatio;
    if (rimSize) where.rimSize = rimSize;

    // Specs
    if (loadIndex && loadIndex !== "all") where.loadIndex = loadIndex;
    if (speedRating && speedRating !== "all") where.speedRating = speedRating;

    // Search filter
    if (search) {
        const parsedSize = parseTireSize(search);
        const orConditions: any[] = [
            { name: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { size: { contains: search, mode: "insensitive" } },
        ];

        if (parsedSize) {
            const sizeFields: any = {};
            if (parsedSize.width) sizeFields.width = parsedSize.width;
            if (parsedSize.aspectRatio) sizeFields.aspectRatio = parsedSize.aspectRatio;
            if (parsedSize.rimSize) sizeFields.rimSize = parsedSize.rimSize;
            orConditions.push(sizeFields);
        }

        where.OR = orConditions;
    }

    // Get unique values for filters (optional optimization: cache this or do separate query)
    // For now, we will just fetch the main data. 
    // Ideally we pass available brands/sizes to the filter component.
    // Let's do a quick grouping to get available options if needed, 
    // but for now let's stick to the main query to keep it fast.

    // Parallel fetch: get total count, paginated data, and absolute price range for filters
    const [totalCount, tires, priceRange] = await Promise.all([
        prisma.tire.count({ where }),
        prisma.tire.findMany({
            where,
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            include: { images: { orderBy: { order: "asc" } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.tire.aggregate({
            _min: { price: true },
            _max: { price: true },
        })
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const tiresWithParsedFeatures = tires.map((tire) => ({
        ...tire,
        features: JSON.parse(tire.features) as string[],
    }));

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <TireFilters
                    tires={tiresWithParsedFeatures}
                    currentPage={page}
                    totalPages={totalPages}
                    initialFilters={{
                        season,
                        condition,
                        search,
                        brand,
                        minPrice,
                        maxPrice,
                        width,
                        aspectRatio,
                        rimSize,
                        loadIndex,
                        speedRating
                    }}
                    priceRange={{
                        min: priceRange._min.price || 0,
                        max: priceRange._max.price || 1000
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}


