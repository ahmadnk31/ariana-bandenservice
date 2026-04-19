import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/db";
import TireFilters from "../../components/TireFilters";
import type { Metadata } from 'next';
import { parseTireSize, getAlternateLanguages } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    return {
        title: metadata.tiresTitle || "Banden",
        description: metadata.tiresDescription || "Bekijk ons assortiment premium banden van topmerken.",
        alternates: {
            canonical: `/${locale}/tires`,
            languages: getAlternateLanguages('/tires'),
        },
    };
}

interface TiresPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TiresPage({ searchParams }: TiresPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const itemsPerPage = 20;

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
    const featureParam = (params.feature as string) || "";
    const selectedFeatures = featureParam ? featureParam.split(',').filter(Boolean) : [];

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

    // Dimensions (allow fallback to the string `size` field to match unstructured data)
    if (width || aspectRatio || rimSize) {
        where.AND = where.AND || [];
        
        if (width) {
            where.AND.push({
                OR: [
                    { width: width },
                    { size: { contains: String(width), mode: "insensitive" } }
                ]
            });
        }
        
        if (aspectRatio) {
            where.AND.push({
                OR: [
                    { aspectRatio: aspectRatio },
                    { size: { contains: String(aspectRatio), mode: "insensitive" } }
                ]
            });
        }
        
        if (rimSize) {
            // Also match "16" alone to be safe, sometimes "R16" is written differently
            where.AND.push({
                OR: [
                    { rimSize: rimSize },
                    { size: { contains: String(rimSize), mode: "insensitive" } }
                ]
            });
        }
    }

    // Specs
    if (loadIndex && loadIndex !== "all") where.loadIndex = loadIndex;
    if (speedRating && speedRating !== "all") where.speedRating = speedRating;

    // Features
    if (selectedFeatures.length > 0) {
        if (!where.AND) where.AND = [];
        selectedFeatures.forEach(f => {
            where.AND.push({ features: { contains: f, mode: "insensitive" } });
        });
    }

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

    // Copy the where clause but remove the brand filter, so we see all brands available for the current search/size
    const whereWithoutBrand = { ...where };
    delete whereWithoutBrand.brand;

    // Parallel fetch: get total count, paginated data, and absolute price range for filters
    const [totalCount, tires, priceRange, brandQuery, specQuery] = await Promise.all([
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
        }),
        prisma.tire.findMany({
            where: whereWithoutBrand,
            select: { brand: true },
            distinct: ['brand'],
            orderBy: { brand: 'asc' },
        }),
        prisma.tire.findMany({
            where: {}, // Get all available specs globally for now to ensure dropdowns are populated
            select: { loadIndex: true, speedRating: true, features: true },
            distinct: ['loadIndex', 'speedRating'], // We still want distinct specs, features will be processed manually
        })
    ]);

    const availableBrands = brandQuery.map(b => b.brand).filter((b): b is string => !!b);
    const availableLoadIndices = Array.from(new Set(specQuery.map(s => s.loadIndex).filter((idx): idx is string => !!idx))).sort();
    const availableSpeedRatings = Array.from(new Set(specQuery.map(s => s.speedRating).filter((r): r is string => !!r))).sort();
    
    // Extract unique features
    const allFeatures = new Set<string>();
    specQuery.forEach(s => {
        if (s.features) {
            try {
                const parsed = JSON.parse(s.features);
                if (Array.isArray(parsed)) {
                    parsed.forEach(f => {
                        // Skip test features
                        if (f.toLowerCase().includes('test')) return;
                        
                        // Extract part before colon if exists
                        const cleanFeature = f.includes(':') ? f.split(':')[0].trim() : f.trim();
                        if (cleanFeature) {
                            allFeatures.add(cleanFeature);
                        }
                    });
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    });
    const availableFeatures = Array.from(allFeatures).sort();

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const tiresWithParsedFeatures = tires.map((tire) => {
        let parsedFeatures: string[] = [];
        try {
            parsedFeatures = tire.features ? JSON.parse(tire.features) : [];
        } catch (e) {
            console.error(`Failed to parse features for tire ${tire.id}:`, e);
        }
        
        return {
            ...tire,
            features: parsedFeatures,
        };
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <TireFilters
                    tires={tiresWithParsedFeatures}
                    availableBrands={availableBrands}
                    availableLoadIndices={availableLoadIndices}
                    availableSpeedRatings={availableSpeedRatings}
                    availableFeatures={availableFeatures}
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
                        speedRating,
                        features: selectedFeatures
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


