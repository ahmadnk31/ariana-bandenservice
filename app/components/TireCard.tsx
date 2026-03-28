"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';
import Price from './Price';
import { ShoppingCart, Flame } from 'lucide-react';
import StockRequestModal from "./StockRequestModal";
import TireLabel from "./TireLabel";

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
    noiseDb
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
            className="p-4 rounded-lg border border-muted bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Carousel */}
            <div 
                ref={carouselRef}
                className="relative w-full h-48 bg-transparent rounded-md mb-4 overflow-hidden select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleCarouselClick}
            >
                <Link href={`/tires/${slug}`}>
                    {images.length > 0 ? (
                        <div className="w-full h-full relative">
                            <div className="w-full h-full relative">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out ${
                                            index === currentImageIndex 
                                                ? 'opacity-100 scale-100 translate-x-0' 
                                                : index < currentImageIndex
                                                    ? 'opacity-0 scale-95 -translate-x-full'
                                                    : 'opacity-0 scale-95 translate-x-full'
                                        }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${name} - Image ${index + 1}`}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-contain aspect-square transition-transform duration-500 group-hover:scale-105"
                                            draggable={false}
                                            priority={index === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
                            <Image
                                src="/tire-placeholder.svg"
                                alt="Tire placeholder"
                                width={200}
                                height={200}
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
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 disabled:opacity-50 ${
                                        index === currentImageIndex ? "bg-primary scale-125" : "bg-background/60 hover:bg-background/80"
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                    disabled={isTransitioning}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Stock Badge */}
                {!inStock && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-medium rounded z-10">
                        {t('outOfStock')}
                    </div>
                )}
                {inStock && stock > 0 && stock <= 5 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded z-10 animate-pulse">
                        {t('lastChance')}
                    </div>
                )}
            </div>

            {/* Low stock urgency bar */}
            {inStock && stock > 0 && stock <= 5 && (
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
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${seasonColors[season] || "bg-gray-500/10 text-gray-600"}`}>
                    {seasonLabels[season] || season}
                </span>
                {(loadIndex || speedRating) && (
                    <span className="text-[10px] text-muted-foreground">
                        {loadIndex && speedRating ? `${loadIndex}${speedRating}` : loadIndex || speedRating}
                    </span>
                )}
            </div>

            {/* Brand & Name */}
            <p className="text-xs text-muted-foreground">{brand}</p>
            <Link href={`/tires/${slug}`} className="block group-hover:text-primary transition-colors">
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
            <ul className="text-xs text-muted-foreground mb-4 space-y-1 flex-1">
                {features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Price & CTA */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted">
                <div>
                    <Price amount={price} size="lg" />
                    <p className="text-[10px] text-green-600 font-medium">{t('freeMontageBalance')}</p>
                    {stock > 0 && stock <= 5 && (
                        <p className="text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 animate-pulse">
                            <Flame className="w-3 h-3" />
                            {t('lowStock', { count: stock })}
                        </p>
                    )}
                    {stock > 5 && (
                        <p className="text-[10px] text-green-600">{t('stockCount', { count: stock })}</p>
                    )}
                </div>
                {stock > 0 ? (
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
                                image: images[0]?.url,
                            });
                        }}
                        className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {t('addToCart')}
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsRequestModalOpen(true);
                        }}
                        className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
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

