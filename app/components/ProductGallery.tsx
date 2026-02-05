"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: { url: string; id: string }[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [zoomProps, setZoomProps] = useState({
        opacity: 0,
        transform: "scale(1)",
        transformOrigin: "center center",
    });

    // Touch handling for swipe gestures
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    const nextImage = useCallback(() => {
        if (isTransitioning || images.length <= 1) return;
        
        setIsTransitioning(true);
        setSelectedIndex((prev) => (prev + 1) % images.length);
        
        setTimeout(() => setIsTransitioning(false), 300);
    }, [images.length, isTransitioning]);

    const prevImage = useCallback(() => {
        if (isTransitioning || images.length <= 1) return;
        
        setIsTransitioning(true);
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
        
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
        
        const distance = Math.abs(touchStartX.current - touchEndX.current);
        if (distance > 10) {
            isDragging.current = true;
        }
    }, [images.length]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (images.length <= 1 || !isDragging.current) return;
        
        const swipeThreshold = 50;
        const swipeDistance = touchStartX.current - touchEndX.current;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            e.preventDefault();
            
            if (swipeDistance > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        
        isDragging.current = false;
        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [images.length, nextImage, prevImage]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full bg-transparent rounded-lg flex items-center justify-center">
                <Image
                    src="/tire-placeholder.svg"
                    alt="Tire placeholder"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-8 opacity-30"
                />
            </div>
        );
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomProps({
            opacity: 1,
            transform: "scale(2)",
            transformOrigin: `${x}% ${y}%`,
        });
    };

    const handleMouseLeave = () => {
        setZoomProps({
            opacity: 0,
            transform: "scale(1)",
            transformOrigin: "center center",
        });
    };

    return (
        <div className="flex flex-col gap-4 group">
            {/* Main Image */}
            <div
                ref={galleryRef}
                className="aspect-square w-full relative bg-transparent rounded-lg overflow-hidden border border-muted cursor-zoom-in select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image Container with Transitions */}
                <div className="w-full h-full relative">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out ${
                                index === selectedIndex 
                                    ? 'opacity-100 scale-100 translate-x-0' 
                                    : index < selectedIndex
                                        ? 'opacity-0 scale-95 -translate-x-full'
                                        : 'opacity-0 scale-95 translate-x-full'
                            }`}
                        >
                            {/* Normal Image */}
                            <img
                                src={image.url}
                                alt={`${name} - View ${index + 1}`}
                                className="w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-300"
                                style={{ opacity: index === selectedIndex && zoomProps.opacity === 1 ? 0 : 1 }}
                                draggable={false}
                            />

                            {/* Zoomed Image */}
                            {index === selectedIndex && (
                                <div
                                    className="w-full h-full absolute top-0 left-0 pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${image.url})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        transform: zoomProps.transform,
                                        transformOrigin: zoomProps.transformOrigin,
                                        opacity: zoomProps.opacity,
                                        transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Previous image"
                            disabled={isTransitioning}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Next image"
                            disabled={isTransitioning}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => {
                                if (!isTransitioning) {
                                    setIsTransitioning(true);
                                    setSelectedIndex(index);
                                    setTimeout(() => setIsTransitioning(false), 300);
                                }
                            }}
                            onMouseEnter={() => {
                                if (!isTransitioning) {
                                    setSelectedIndex(index);
                                }
                            }}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 disabled:opacity-50 ${
                                index === selectedIndex ? "border-primary scale-105" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                            disabled={isTransitioning}
                        >
                            <img
                                src={image.url}
                                alt={`${name} thumbnail ${index + 1}`}
                                className="w-full h-full object-contain"
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
