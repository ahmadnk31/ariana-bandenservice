"use client";

import { useState, useRef, useCallback } from "react";


interface ProductGalleryProps {
    images: { url: string; id: string }[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isZooming, setIsZooming] = useState(false);
    
    const ZOOM_WINDOW_SIZE = 400;
    const ZOOM_FACTOR = 2.5;
    const LENS_SIZE = ZOOM_WINDOW_SIZE / ZOOM_FACTOR;

    const [zoomState, setZoomState] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        lensX: 0,
        lensY: 0
    });

    // Touch handling for swipe gestures
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const galleryRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLDivElement>(null);

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
                <img
                    src="/tire-placeholder.svg"
                    alt="Tire placeholder"
                    className="w-full h-full object-contain p-8 opacity-30"
                />
            </div>
        );
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const currentImgElement = document.getElementById(`gallery-img-${selectedIndex}`);
        if (!currentImgElement) return;

        const rect = currentImgElement.getBoundingClientRect();
        
        // Mouse position relative to the image
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if cursor is actually over the image
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            if (isZooming) setIsZooming(false);
            return;
        }

        // Clamp lens position inside the image bounds
        const clampedX = Math.max(LENS_SIZE / 2, Math.min(x, rect.width - LENS_SIZE / 2));
        const clampedY = Math.max(LENS_SIZE / 2, Math.min(y, rect.height - LENS_SIZE / 2));

        const containerRect = galleryRef.current?.getBoundingClientRect();
        let lensContainerX = 0;
        let lensContainerY = 0;
        
        if (containerRect) {
            // Lens position relative to the gallery container
            lensContainerX = (rect.left - containerRect.left) + clampedX;
            lensContainerY = (rect.top - containerRect.top) + clampedY;
        }

        setZoomState({
            x: clampedX,
            y: clampedY,
            width: rect.width,
            height: rect.height,
            lensX: lensContainerX,
            lensY: lensContainerY
        });

        if (!isZooming) {
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const currentImage = images[selectedIndex];

    return (
        <div className="flex flex-row gap-3 group relative">
            {/* Vertical Thumbnails (left side) */}
            {images.length > 1 && (
                <div className="hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 pr-1">
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
                            className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 disabled:opacity-50 ${
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

            <div className="flex flex-col gap-3 flex-1 min-w-0">
                {/* Main Image */}
                <div
                    ref={galleryRef}
                    className="aspect-square w-full max-h-[400px] relative bg-transparent rounded-lg overflow-hidden border border-muted cursor-crosshair select-none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div ref={mainImageRef} className="w-full h-full relative">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                                    index === selectedIndex
                                        ? 'opacity-100 scale-100 translate-x-0'
                                        : index < selectedIndex
                                            ? 'opacity-0 scale-95 -translate-x-full'
                                            : 'opacity-0 scale-95 translate-x-full'
                                }`}
                            >
                                <img
                                    id={`gallery-img-${index}`}
                                    src={image.url}
                                    alt={`${name} - View ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Lens Indicator (desktop only) */}
                    {isZooming && zoomState.width > 0 && (
                        <div
                            className="hidden md:block absolute pointer-events-none z-20 rounded-sm border-2 border-primary/60 bg-primary/5"
                            style={{
                                width: LENS_SIZE,
                                height: LENS_SIZE,
                                left: zoomState.lensX - LENS_SIZE / 2,
                                top: zoomState.lensY - LENS_SIZE / 2,
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.15)',
                            }}
                        />
                    )}

                    {/* Magnifier icon hint */}
                    {!isZooming && (
                        <div className="hidden md:flex absolute bottom-3 right-3 items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-muted text-muted-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            Hover to zoom
                        </div>
                    )}

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

                {/* Mobile-only horizontal thumbnails */}
                {images.length > 1 && (
                    <div className="sm:hidden relative">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
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
                                    className={`relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 disabled:opacity-50 ${
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
                    </div>
                )}
            </div>

            {/* Zoom Window — separate panel to the right (desktop only) */}
            <div
                className={`hidden md:block absolute left-[calc(100%+16px)] top-0 w-[${ZOOM_WINDOW_SIZE}px] h-[${ZOOM_WINDOW_SIZE}px] rounded-xl border border-muted bg-white dark:bg-gray-900 shadow-2xl overflow-hidden z-50 pointer-events-none transition-opacity duration-200 ${
                    isZooming ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ width: ZOOM_WINDOW_SIZE, height: ZOOM_WINDOW_SIZE }}
            >
                {isZooming && zoomState.width > 0 && (
                    <img
                        src={currentImage.url}
                        alt="Zoomed view"
                        className="max-w-none absolute pointer-events-none"
                        style={{
                            width: zoomState.width * ZOOM_FACTOR,
                            height: zoomState.height * ZOOM_FACTOR,
                            left: -(zoomState.x * ZOOM_FACTOR) + (ZOOM_WINDOW_SIZE / 2),
                            top: -(zoomState.y * ZOOM_FACTOR) + (ZOOM_WINDOW_SIZE / 2),
                        }}
                    />
                )}
            </div>
        </div>
    );
}
