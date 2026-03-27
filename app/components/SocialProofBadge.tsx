"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Eye, TrendingUp } from "lucide-react";

interface SocialProofBadgeProps {
    stock: number;
}

export default function SocialProofBadge({ stock }: SocialProofBadgeProps) {
    const t = useTranslations("Tires");
    const [viewerCount, setViewerCount] = useState(0);
    const [soldCount, setSoldCount] = useState(0);

    useEffect(() => {
        // Generate a realistic-looking viewer count based on stock scarcity
        // Lower stock = higher perceived interest
        const baseViewers = stock <= 5 ? 8 : stock <= 15 ? 5 : 3;
        const variance = Math.floor(Math.random() * 6); // 0-5
        setViewerCount(baseViewers + variance);

        // Generate a sold count (only shown when stock is low for extra urgency)
        if (stock > 0 && stock <= 10) {
            setSoldCount(Math.floor(Math.random() * 4) + 2); // 2-5
        }

        // Periodically update viewer count to feel "live"
        const interval = setInterval(() => {
            const newBase = stock <= 5 ? 8 : stock <= 15 ? 5 : 3;
            const newVariance = Math.floor(Math.random() * 6);
            setViewerCount(newBase + newVariance);
        }, 30000); // Update every 30s

        return () => clearInterval(interval);
    }, [stock]);

    if (viewerCount === 0) return null;

    return (
        <div className="flex flex-col gap-1.5">
            {/* People viewing now */}
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="w-3.5 h-3.5" />
                <span>{t("peopleViewing", { count: viewerCount })}</span>
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </div>

            {/* Sold recently (only when stock is low) */}
            {soldCount > 0 && (
                <div className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{t("soldRecently", { count: soldCount })}</span>
                </div>
            )}
        </div>
    );
}
