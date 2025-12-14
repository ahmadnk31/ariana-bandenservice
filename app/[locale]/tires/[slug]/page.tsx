import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductGallery from "@/app/components/ProductGallery";
import Link from "next/link";
import TireCard from "@/app/components/TireCard";
import { getTranslations } from "next-intl/server";
import ProductAddToCart from "@/app/components/ProductAddToCart";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tire = await prisma.tire.findUnique({
        where: { slug },
        include: { images: { orderBy: { order: "asc" } } },
    });

    if (!tire) {
        return {
            title: "Tire Not Found",
            description: "The requested tire could not be found.",
        };
    }

    const title = `${tire.name} | Ariana Bandenservice`;
    const description = `Buy ${tire.brand} ${tire.name} (${tire.size}) - ${tire.season} tire. Price: €${tire.price}. Professional fitting available.`;
    const images = tire.images.map(img => img.url);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: images.length > 0 ? images : ["/banden-service/android-chrome-512x512.png"],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: images.length > 0 ? images : ["/banden-service/android-chrome-512x512.png"],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    const tire = await prisma.tire.findUnique({
        where: { slug },
        include: { images: { orderBy: { order: "asc" } } },
    });

    if (!tire) {
        notFound();
    }

    const t = await getTranslations("Tires");

    // Fetch related tires: same brand OR same size, excluding current tire
    const relatedTires = await prisma.tire.findMany({
        where: {
            AND: [
                { id: { not: tire.id } },
                {
                    OR: [
                        { brand: tire.brand },
                        { size: tire.size }
                    ]
                }
            ]
        },
        take: 4,
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        orderBy: {
            // Prioritize matching brand
            brand: 'asc'
        }
    });

    const features = JSON.parse(tire.features) as string[];

    const seasonLabels: Record<string, string> = {
        summer: t('seasonSummer'),
        winter: t('seasonWinter'),
        "all-season": t('seasonAllSeason'),
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                {/* Breadcrumb / Back Link */}
                <div className="container mx-auto px-4 py-6">
                    <Link href="/tires" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        {t('backToTires')}
                    </Link>
                </div>

                <section className="container mx-auto px-4 pb-20">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                        {/* Left: Gallery */}
                        <div>
                            <ProductGallery images={tire.images} name={tire.name} />
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col">
                            <div className="mb-2">
                                <span className="text-sm font-medium text-primary uppercase tracking-wider">{tire.brand}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{tire.name}</h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                {tire.condition === "used" && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-500 text-white uppercase tracking-wider shadow-sm">
                                        {t('secondHand')}
                                    </span>
                                )}
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted">
                                    {seasonLabels[tire.season] || tire.season}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted">
                                    {t('size')}: {tire.size}
                                </span>
                                {(tire.loadIndex || tire.speedRating) && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted">
                                        {t('loadIndex')}: {tire.loadIndex}{tire.speedRating}
                                    </span>
                                )}
                            </div>

                            <div className="text-3xl font-bold mb-6">
                                €{tire.price.toFixed(2)}
                                {tire.stock > 0 && <span className="text-sm font-normal text-muted-foreground ml-3">({tire.stock} in stock)</span>}
                            </div>

                            <hr className="border-muted mb-8" />

                            <div className="prose prose-sm max-w-none text-muted-foreground mb-8">
                                {tire.description ? (
                                    <p>{tire.description}</p>
                                ) : (
                                    <p>{t('noDescription')}</p>
                                )}
                            </div>

                            <div className="mb-8">
                                <h3 className="font-semibold text-foreground mb-4">Key Features</h3>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto">
                                <ProductAddToCart
                                    tire={{
                                        id: tire.id,
                                        name: tire.name,
                                        slug: tire.slug,
                                        brand: tire.brand,
                                        size: tire.size,
                                        price: tire.price,
                                        stock: tire.stock,
                                        image: tire.images[0]?.url,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedTires.length > 0 && (
                    <section className="bg-muted py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-8">{t('relatedProducts')}</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedTires.map((relatedTire) => (
                                    <TireCard
                                        key={relatedTire.id}
                                        {...relatedTire}
                                        features={JSON.parse(relatedTire.features)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}
