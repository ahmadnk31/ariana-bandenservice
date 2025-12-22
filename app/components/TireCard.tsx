"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';
import { ShoppingCart } from 'lucide-react';
import StockRequestModal from "./StockRequestModal";

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
    description
}: TireCardProps) {
    const t = useTranslations('Tires');
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

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

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="p-4 rounded-lg border border-muted bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col group relative">
            {/* Image Carousel */}
            <div className="relative w-full h-48 bg-muted rounded-md mb-4 overflow-hidden">
                <Link href={`/tires/${slug}`}>
                    {images.length > 0 ? (
                        <div className="w-full h-full relative">
                            <Image
                                src={images[currentImageIndex].url}
                                alt={`${name} - Image ${currentImageIndex + 1}`}
                                width={500}
                                height={500}
                                className="w-full h-full object-contain aspect-square transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                            />
                            {/* Overlay to ensure clickability if needed, mostly img is fine */}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="6"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                            </svg>
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
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors z-10 opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors z-10 opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.preventDefault(); setCurrentImageIndex(index); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-primary" : "bg-background/60"
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
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
            </div>

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
                    <span className="text-xl font-bold">€{price}</span>
                    {stock > 0 && (
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

