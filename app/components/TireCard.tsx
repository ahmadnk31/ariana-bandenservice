"use client";


import { Link } from "@/src/i18n/routing";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';
import Price from './Price';
import { ShoppingCart, Flame, Info } from 'lucide-react';
import StockRequestModal from "./StockRequestModal";
import TireLabel from "./TireLabel";
import SeasonIcon from "./SeasonIcon";
import { getBrandLogo } from "@/lib/utils";

function FeatureTooltip({ description }: { description: string }) {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShow(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setShow(false), 150);
    };

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShow(!show);
            }}
        >
            <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary cursor-help transition-colors flex-shrink-0" />
            {show && (
                <span
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-[11px] leading-relaxed text-popover-foreground bg-popover border border-border rounded-lg shadow-lg z-50 w-56 animate-in fade-in-0 zoom-in-95 duration-200"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {description}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] border-4 border-transparent border-t-popover" />
                </span>
            )}
        </span>
    );
}

interface TireImage {
    id: string;
    url: string;
    key: string;
    order: number;
}

interface TireCardProps {
    id: string;
    name: string;
    slug: string;
    brand: string;
    season: string;
    condition?: string; // Add condition
    size: string;
    price: number;
    originalPrice?: number | null;
    features: string[];
    images: TireImage[];
    loadIndex?: string | null;
    speedRating?: string | null;
    stock?: number;
    inStock?: boolean;
    description?: string | null;
    efficiency?: string | null;
    grip?: string | null;
    noise?: string | null;
    noiseDb?: number | null;
    viewMode?: "grid" | "list";
    primaryAction?: "cart" | "appointment";
}

export default function TireCard({
    id,
    name,
    slug,
    brand,
    season,
    condition = "new", // Default
    size,
    price,
    originalPrice,
    features,
    images,
    loadIndex,
    speedRating,
    stock = 0,
    inStock = true,
    description,
    efficiency,
    grip,
    noise,
    noiseDb,
    viewMode = "grid",
    primaryAction = "cart"
}: TireCardProps) {
    const t = useTranslations('Tires');
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Touch handling for swipe gestures
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const hasDiscount = originalPrice && originalPrice > price;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const seasonLabels: Record<string, string> = {
        summer: t('seasons.summer'),
        winter: t('seasons.winter'),
        "all-season": t('seasons.all-season'),
    };

    const seasonColors: Record<string, string> = {
        summer: "bg-amber-500/10 text-amber-600",
        winter: "bg-primary/10 text-primary",
        "all-season": "bg-green-500/10 text-green-600",
    };

    const nextImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.preventDefault(); // Prevent link click
        if (isTransitioning) return; // Prevent rapid clicking

        setIsTransitioning(true);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);

        // Reset transition state after animation
        setTimeout(() => setIsTransitioning(false), 300);
    }, [images.length, isTransitioning]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.preventDefault(); // Prevent link click
        if (isTransitioning) return; // Prevent rapid clicking

        setIsTransitioning(true);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

        // Reset transition state after animation
        setTimeout(() => setIsTransitioning(false), 300);
    }, [images.length, isTransitioning]);

    // Touch event handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (images.length <= 1) return;
        touchStartX.current = e.touches[0].clientX;
        isDragging.current = false;
    }, [images.length]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (images.length <= 1) return;
        touchEndX.current = e.touches[0].clientX;

        // Calculate distance moved
        const distance = Math.abs(touchStartX.current - touchEndX.current);

        // Mark as dragging if moved more than 10px
        if (distance > 10) {
            isDragging.current = true;
        }
    }, [images.length]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (images.length <= 1 || !isDragging.current) return;

        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchStartX.current - touchEndX.current;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            e.preventDefault(); // Prevent link navigation

            if (swipeDistance > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }

        // Reset touch state
        isDragging.current = false;
        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [images.length, nextImage, prevImage]);

    // Handle clicks - prevent navigation if we were dragging
    const handleCarouselClick = useCallback((e: React.MouseEvent) => {
        if (isDragging.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    // Auto-cycling effect for hover
    useEffect(() => {
        if (isHovered && images.length > 1 && !isTransitioning) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1500); // Change image every 1.5 seconds
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isHovered, images.length, isTransitioning]);

    // Hover handlers
    const handleMouseEnter = useCallback(() => {
        if (images.length > 1) {
            setIsHovered(true);
        }
    }, [images.length]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        // Reset to first image when hover ends
        if (images.length > 1) {
            setTimeout(() => {
                setCurrentImageIndex(0);
            }, 200);
        }
    }, [images.length]);

    return (
        <div
            className={`p-3 rounded-lg border border-muted bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex group relative ${viewMode === "list" ? "flex-col sm:flex-row items-stretch gap-6" : "flex-col"
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Carousel */}
            <div
                ref={carouselRef}
                className={`relative bg-transparent rounded-md overflow-hidden select-none flex-shrink-0 ${viewMode === "list" ? "w-full sm:w-48 h-48 sm:h-auto min-h-[192px] mb-4 sm:mb-0" : "w-full h-48 mb-3"
                    }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleCarouselClick}
            >
                <Link href={{ pathname: '/tires/[slug]', params: { slug: slug } }}>
                    {images.length > 0 ? (
                        <div className="w-full h-full relative">
                            <div className="w-full h-full relative">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out ${index === currentImageIndex
                                            ? 'opacity-100 scale-100 translate-x-0'
                                            : index < currentImageIndex
                                                ? 'opacity-0 scale-95 -translate-x-full'
                                                : 'opacity-0 scale-95 translate-x-full'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${name} - Image ${index + 1}`}
                                            className="w-full h-full object-contain aspect-square transition-transform duration-500 group-hover:scale-105"
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
                            <img
                                src="/tire-placeholder.svg"
                                alt="Tire placeholder"
                                className="w-full h-full object-contain opacity-30"
                                draggable={false}
                            />
                        </div>
                    )}
                </Link>

                {condition === "used" && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-bold uppercase tracking-wider rounded z-10 shadow-sm">
                        {t('secondHand')}
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                prevImage(e);
                                setIsHovered(false); // Stop auto-cycling when manually navigating
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Previous image"
                            disabled={isTransitioning}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                            onClick={(e) => {
                                nextImage(e);
                                setIsHovered(false); // Stop auto-cycling when manually navigating
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Next image"
                            disabled={isTransitioning}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!isTransitioning) {
                                            setIsTransitioning(true);
                                            setCurrentImageIndex(index);
                                            setIsHovered(false); // Stop auto-cycling when manually selecting
                                            setTimeout(() => setIsTransitioning(false), 300);
                                        }
                                    }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 disabled:opacity-50 ${index === currentImageIndex ? "bg-primary scale-125" : "bg-background/60 hover:bg-background/80"
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                    disabled={isTransitioning}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Stock Badge */}
                {!inStock ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-medium rounded z-10">
                        {t('outOfStock')}
                    </div>
                ) : stock > 0 && stock <= 3 ? (
                    <div className={`absolute right-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded z-10 animate-pulse ${hasDiscount ? 'top-9' : 'top-2'}`}>
                        {t('lastChance')}
                    </div>
                ) : null}

                {/* Sale Badge */}
                {hasDiscount && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded z-10 shadow-sm transform -rotate-2">
                        -{discountPercentage}% SALE
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                {/* Low stock urgency bar */}
                {inStock && stock > 0 && stock <= 3 && (
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-semibold text-orange-600">{t('hurryUp')}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max((stock / 10) * 100, 10)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Season Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${season === 'summer' ? 'bg-amber-500/10 text-amber-600 border-amber-200/50' :
                        season === 'winter' ? 'bg-blue-500/10 text-blue-600 border-blue-200/50' :
                            'bg-green-500/10 text-green-600 border-green-200/50'
                        }`}>
                        <SeasonIcon season={season} size="sm" />
                        {seasonLabels[season] || season}
                    </span>
                    {(loadIndex || speedRating) && (
                        <span className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-1.5 py-0.5 rounded border border-muted/50">
                            {loadIndex && speedRating ? `${loadIndex}${speedRating}` : loadIndex || speedRating}
                        </span>
                    )}
                </div>

                {/* Brand & Name */}
                {(() => {
                    const logo = getBrandLogo(brand);
                    return logo ? (
                        <div className="mb-2 h-8 sm:h-10 w-full flex justify-start">
                            <img src={logo} alt={brand} className="h-full max-w-[120px] object-contain object-left" />
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">{brand}</p>
                    );
                })()}
                <Link href={{ pathname: '/tires/[slug]', params: { slug: slug } }} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-base font-bold mb-2 leading-tight">{name}</h3>
                </Link>

                {/* Size */}
                <p className="text-xs text-muted-foreground mb-4">{t('size')}: {size}</p>

                {/* EU Label */}
                {(efficiency || grip || noise || noiseDb) && (
                    <div className="mb-4">
                        <TireLabel
                            efficiency={efficiency}
                            grip={grip}
                            noise={noise}
                            noiseDb={noiseDb}
                            size="sm"
                        />
                    </div>
                )}

                {/* Features */}
                <ul className="text-xs text-muted-foreground mb-4 space-y-1.5 flex-1">
                    {features.slice(0, 3).map((feature, index) => {
                        const colonIndex = feature.indexOf(':');
                        if (colonIndex !== -1) {
                            const label = feature.substring(0, colonIndex).trim();
                            const description = feature.substring(colonIndex + 1).trim();
                            return (
                                <li key={index} className="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    <span className="font-medium text-foreground">{label}</span>
                                    {description && (
                                        <FeatureTooltip description={description} />
                                    )}
                                </li>
                            );
                        }
                        return (
                            <li key={index} className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {feature}
                            </li>
                        );
                    })}
                </ul>

            </div>

            {/* Price & CTA */}
            <div className={`pt-4 border-muted transition-all duration-300 ${viewMode === "list"
                    ? "mt-4 sm:mt-0 sm:w-48 sm:pl-6 border-t sm:border-t-0 sm:border-l flex flex-col justify-center sm:items-end items-center gap-3 flex-shrink-0"
                    : "mt-auto border-t flex items-center justify-between"
                }`}>
                <div className={viewMode === "list" ? "text-center sm:text-right" : ""}>
                    {hasDiscount && (
                        <div className={`text-[11px] text-muted-foreground line-through font-medium mb-0.5 ${viewMode === "list" ? "text-center sm:text-right" : "text-left"}`}>
                            €{originalPrice?.toFixed(2)}
                        </div>
                    )}
                    <div className={`flex items-baseline gap-1 ${viewMode === "list" ? "justify-center sm:justify-end" : "justify-start"}`}>
                        {hasDiscount ? (
                            <span className="text-lg sm:text-xl font-bold tracking-tight text-red-600 leading-none">
                                €{price.toFixed(2)}
                            </span>
                        ) : (
                            <Price amount={price} size="lg" />
                        )}
                        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider">excl. BTW</span>
                    </div>
                    {stock > 0 && stock <= 3 && (
                        <p className={`text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 animate-pulse mt-0.5 ${viewMode === "list" ? "justify-center sm:justify-end" : ""}`}>
                            <Flame className="w-3 h-3" />
                            {t('lowStock', { count: stock })}
                        </p>
                    )}
                </div>
                {stock > 0 ? (
                    primaryAction === "appointment" ? (
                        <Link
                            href={{ pathname: '/appointment', query: { tireId: id, tireName: name } }}
                            className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap ${viewMode === "list" ? "w-full" : ""
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {t('makeAppointment')}
                        </Link>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                    id,
                                    name,
                                    slug,
                                    brand,
                                    size,
                                    price,
                                    stock,
                                    season,
                                    image: images[0]?.url,
                                });
                            }}
                            className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap ${viewMode === "list" ? "w-full" : ""
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {t('addToCart')}
                        </button>
                    )
                ) : (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsRequestModalOpen(true);
                        }}
                        className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap ${viewMode === "list" ? "w-full" : ""
                            }`}
                    >
                        {t('requestStock')}
                    </button>
                )}
            </div>

            {isRequestModalOpen && (
                <StockRequestModal
                    tireId={id}
                    tireName={name}
                    onClose={() => setIsRequestModalOpen(false)}
                />
            )}
        </div>
    );
}

