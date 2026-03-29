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
import ExpandableDescription from "@/app/components/ExpandableDescription";
import SocialProofBadge from "@/app/components/SocialProofBadge";
import Price from "@/app/components/Price";
import { getAlternateLanguages } from "@/lib/utils";
import TireLabel from "@/app/components/TireLabel";
import SeasonIcon from "@/app/components/SeasonIcon";

interface ProductPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug, locale } = await params;
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

    const title = `${tire.name} | Gent bandenservice`;
    const ogTitle = `${tire.brand} ${tire.name} - €${tire.price.toFixed(2)} | Gent bandenservice`;
    const description = `€${tire.price.toFixed(2)} incl. mounting & balancing ✓ ${tire.brand} ${tire.name} (${tire.size}) - ${tire.season} tire. Professional fitting available.`;
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gentbandenservice.be";
    const fallbackImage = `${siteUrl}/gentbandenservice/android-chrome-512x512.png`;

    // Use only the first image for OG/Twitter - social platforms prefer a single clear image
    const firstImage = tire.images.length > 0
        ? (tire.images[0].url.startsWith("http") ? tire.images[0].url : `${siteUrl}${tire.images[0].url}`)
        : fallbackImage;

    return {
        title,
        description,
        openGraph: {
            title: ogTitle,
            description,
            images: [
                {
                    url: firstImage,
                    width: 1200,
                    height: 630,
                    alt: `${tire.brand} ${tire.name} - ${tire.size}`,
                },
            ],
            type: "website",
            url: `${siteUrl}/${locale}/tires/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description,
            images: [
                {
                    url: firstImage,
                    alt: `${tire.brand} ${tire.name} - ${tire.size}`,
                },
            ],
        },
        alternates: {
            canonical: `/${locale}/tires/${slug}`,
            languages: getAlternateLanguages(`/tires/${slug}`),
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug, locale } = await params;

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
            brand: 'asc'
        }
    });

    const features = JSON.parse(tire.features) as string[];

    const seasonLabels: Record<string, string> = {
        summer: t('seasonSummer'),
        winter: t('seasonWinter'),
        "all-season": t('seasonAllSeason'),
    };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gentbandenservice.be';

    // Product JSON-LD
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": tire.name,
        "image": tire.images.length > 0 ? tire.images.map(img => img.url) : [`${baseUrl}/banden-service/android-chrome-512x512.png`],
        "description": tire.description || `${tire.brand} ${tire.name} (${tire.size}) - ${seasonLabels[tire.season] || tire.season} tire`,
        "brand": {
            "@type": "Brand",
            "name": tire.brand
        },
        "sku": tire.id,
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/${locale}/tires/${tire.slug}`,
            "priceCurrency": "EUR",
            "price": tire.price.toFixed(2),
            "availability": tire.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Gent Bandenservice"
            }
        }
    };

    // Breadcrumb JSON-LD
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${baseUrl}/${locale}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": t('backToTires').replace('← ', ''),
                "item": `${baseUrl}/${locale}/tires`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": tire.name
            }
        ]
    };

    return (
        <div className="min-h-screen flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
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
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide border shadow-sm ${
                                    tire.season === 'summer' ? 'bg-amber-500/10 text-amber-600 border-amber-200/50' :
                                    tire.season === 'winter' ? 'bg-blue-500/10 text-blue-600 border-blue-200/50' :
                                    'bg-green-500/10 text-green-600 border-green-200/50'
                                }`}>
                                    <SeasonIcon season={tire.season} size="md" />
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

                            {/* EU Tire Label */}
                            {(tire.efficiency || tire.grip || tire.noise || tire.noiseDb) && (
                                <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-muted">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">EU Tire Label</h3>
                                    <TireLabel 
                                        efficiency={tire.efficiency} 
                                        grip={tire.grip} 
                                        noise={tire.noise} 
                                        noiseDb={tire.noiseDb} 
                                        size="md" 
                                    />
                                </div>
                            )}

                            <div className="text-3xl font-bold mb-4">
                                <Price amount={tire.price} size="xl" />
                                {tire.stock > 0 && <span className="text-sm font-normal text-muted-foreground ml-3">({tire.stock} in stock)</span>}
                            </div>

                            {/* Urgency: Low stock alert */}
                            {tire.stock > 0 && tire.stock <= 5 && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-semibold mb-4 animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                                    {t('lowStock', { count: tire.stock })}
                                </div>
                            )}

                            {/* Social proof badges */}
                            <div className="flex flex-col gap-2 mb-4">
                                <SocialProofBadge stock={tire.stock} />
                            </div>

                            <hr className="border-muted mb-8" />

                            <div className="prose prose-sm max-w-none text-muted-foreground mb-8">
                                {tire.description ? (
                                    <ExpandableDescription description={tire.description} />
                                ) : (
                                    <p>{t('noDescription')}</p>
                                )}
                            </div>

                            {features.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-semibold text-foreground mb-4">{t('keyFeatures')}</h3>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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
                                        season: tire.season,
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
