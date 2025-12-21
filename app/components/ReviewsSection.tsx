"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { Star, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface Review {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    profile_photo_url: string;
}

export default function ReviewsSection() {
    const t = useTranslations('Home.reviews');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 6000, stopOnInteraction: true }),
    ]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch("/api/reviews");
                const data = await res.json();
                if (data.reviews) {
                    setReviews(data.reviews);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    if (loading) return null;
    if (!reviews.length) return null;

    return (
        <section className="py-24 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-600 mb-6 border border-yellow-400/20">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-[11px] font-bold tracking-wider uppercase">{t('googleTrusted')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="relative mb-12" ref={emblaRef}>
                    <div className="flex gap-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-1">
                                <ReviewCard {...review} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <a
                        href="https://www.google.com/maps/place/ARIANA+Bandenservice/@51.0516972,3.7536583,748m/data=!3m1!1e3!4m8!3m7!1s0x47c37700051d85b7:0xcde1d6416f99d9f2!8m2!3d51.0516972!4d3.7562332!9m1!1b1!16s%2Fg%2F11y4yrfhx1?authuser=0&entry=ttu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                    >
                        {t('viewAll')}
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}
