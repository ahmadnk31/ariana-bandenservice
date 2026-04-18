"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function useCountUp(target: number, duration = 1800, start = false, decimals = 0) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const raw = eased * target;
            setCount(decimals > 0 ? parseFloat(raw.toFixed(decimals)) : Math.floor(raw));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start, decimals]);

    return count;
}

interface StatItemProps {
    icon: string;
    value: number;
    suffix: string;
    label: string;
    color: string;
    animate: boolean;
    decimals?: number;
}

function StatItem({ icon, value, suffix, label, color, animate, decimals = 0 }: StatItemProps) {
    const count = useCountUp(value, 1800, animate, decimals);
    const display = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString("nl-BE");
    return (
        <div className="flex flex-col items-center text-center group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            </div>
            <div className="text-4xl font-black tracking-tight text-foreground">
                {display}{suffix}
            </div>
            <div className="text-sm text-muted-foreground font-medium mt-1 max-w-[120px] leading-tight">{label}</div>
        </div>
    );
}

export default function WorkshopStrip() {
    const t = useTranslations("Home.workshop");
    const ref = useRef<HTMLDivElement>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        {
            icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
            value: 15,
            suffix: "+",
            label: t("yearsExperience"),
            color: "bg-primary/10 text-primary",
        },
        {
            icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
            value: 8000,
            suffix: "+",
            label: t("happyCustomers"),
            color: "bg-green-500/10 text-green-600",
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            value: 50,
            suffix: "+",
            label: t("brands"),
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
            value: 4.9,
            suffix: "★",
            label: t("googleRating"),
            color: "bg-yellow-400/10 text-yellow-600",
            decimals: 1,
        },
    ];

    return (
        <section ref={ref} className="py-16 bg-background border-y border-muted">
            <div className="container mx-auto px-4">
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10">
                    {t("tagline")}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat) => (
                        <StatItem key={stat.label} {...stat} animate={animate} />
                    ))}
                </div>
            </div>
        </section>
    );
}
