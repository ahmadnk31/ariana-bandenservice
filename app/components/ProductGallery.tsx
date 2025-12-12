"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: { url: string; id: string }[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoomProps, setZoomProps] = useState({
        opacity: 0,
        transform: "scale(1)",
        transformOrigin: "center center",
    });

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
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
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
                className="aspect-square w-full relative bg-muted rounded-lg overflow-hidden border border-muted cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Normal Image */}
                <img
                    src={images[selectedIndex].url}
                    alt={`${name} - View ${selectedIndex + 1}`}
                    className="w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-300 mix-blend-multiply"
                    style={{ opacity: zoomProps.opacity === 1 ? 0 : 1 }}
                />

                {/* Zoomed Image */}
                <div
                    className="w-full h-full absolute top-0 left-0 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: `url(${images[selectedIndex].url})`,
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        transform: zoomProps.transform,
                        transformOrigin: zoomProps.transformOrigin,
                        opacity: zoomProps.opacity,
                        transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
                    }}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${index === selectedIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={`${name} thumbnail ${index + 1}`}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
