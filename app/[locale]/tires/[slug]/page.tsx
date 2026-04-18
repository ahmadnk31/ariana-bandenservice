import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductGallery from "@/app/components/ProductGallery";
import { Link } from "@/src/i18n/routing";
import TireCard from "@/app/components/TireCard";
import { getTranslations } from "next-intl/server";
import ProductAddToCart from "@/app/components/ProductAddToCart";
import ProductTabs from "@/app/components/ProductTabs";
import SocialProofBadge from "@/app/components/SocialProofBadge";
import Price from "@/app/components/Price";
import { getAlternateLanguages, getBrandLogo } from "@/lib/utils";
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
            title: locale === 'nl' ? "Band niet gevonden" : "Tire Not Found",
            description: locale === 'nl' ? "De opgevraagde band kon niet worden gevonden." : "The requested tire could not be found.",
        };
    }

    const title = `${tire.name} | Gent bandenservice`;
    const ogTitle = `${tire.name} (${tire.size}) - €${tire.price.toFixed(2)} | Gent bandenservice`;

    const seasonMap: Record<string, string> = {
        nl: tire.season === 'summer' ? 'zomerband' : tire.season === 'winter' ? 'winterband' : '4-seizoenenband',
        en: tire.season === 'summer' ? 'summer tire' : tire.season === 'winter' ? 'winter tire' : 'all-season tire'
    };

    const description = locale === 'nl'
        ? `€${tire.price.toFixed(2)} incl. montage & balanceren ✓ ${tire.name} (${tire.size}) - ${seasonMap.nl}. Professionele montage beschikbaar.`
        : `€${tire.price.toFixed(2)} incl. mounting & balancing ✓ ${tire.name} (${tire.size}) - ${seasonMap.en}. Professional fitting available.`;
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
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 overflow-visible">
                        {/* Left: Gallery */}
                        <div className="relative" style={{ zIndex: 20 }}>
                            <ProductGallery images={tire.images} name={tire.name} />
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col">
                            <div className="mb-4">
                                {(() => {
                                    const logo = getBrandLogo(tire.brand);
                                    return logo ? (
                                        <div className="h-12 md:h-14 w-full flex justify-start mb-2">
                                            <img src={logo} alt={tire.brand} className="h-full max-w-[180px] object-contain object-left" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-medium text-primary uppercase tracking-wider">{tire.brand}</span>
                                    );
                                })()}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1 text-foreground">{tire.name}</h1>
                            <h2 className="text-sm md:text-base text-muted-foreground mb-4 font-normal">
                                {t('seoSubTitle', { brand: tire.brand, season: seasonLabels[tire.season] || tire.season })}
                            </h2>

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

                            {(() => {
                                const originalPrice = tire.originalPrice as number | null;
                                const hasDiscount = originalPrice && originalPrice > tire.price;
                                const discountPercentage = hasDiscount ? Math.round(((originalPrice - tire.price) / originalPrice) * 100) : 0;
                                
                                return (
                                    <div className="mb-4">
                                        {hasDiscount && (
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xl line-through text-muted-foreground font-medium">
                                                    €{originalPrice?.toFixed(2)}
                                                </span>
                                                <span className="px-2.5 py-1 bg-red-600 text-white text-sm font-black uppercase tracking-wider rounded shadow-sm transform -rotate-1">
                                                    -{discountPercentage}% SALE
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-2">
                                            {hasDiscount ? (
                                                <span className="text-4xl font-bold tracking-tight text-red-600 leading-none">
                                                    €{tire.price.toFixed(2)}
                                                </span>
                                            ) : (
                                                <Price amount={tire.price} size="xl" />
                                            )}
                                            {tire.stock > 0 && tire.stock <= 3 && <span className="text-sm font-normal text-muted-foreground ml-3">({tire.stock} in stock)</span>}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Urgency: Low stock alert */}
                            {tire.stock > 0 && tire.stock <= 3 && (
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

                                {/* Trust badges */}
                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    {[
                                        { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: t('guarantee') || "2 jaar garantie", color: "text-green-600" },
                                        { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: t('fastInstall') || "Snel gemonteerd", color: "text-blue-600" },
                                        { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: t('expertAdvice') || "Gratis advies", color: "text-primary" },
                                        { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: t('easyReturn') || "Makkelijk retour", color: "text-orange-600" },
                                    ].map(({ icon, label, color }) => (
                                        <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-muted text-xs font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 flex-shrink-0 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                            </svg>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ProductTabs 
                    description={tire.description} 
                    features={features} 
                    relatedTires={relatedTires} 
                />
            </main>
            <Footer />
        </div>
    );
}
