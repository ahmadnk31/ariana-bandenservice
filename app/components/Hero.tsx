"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/src/i18n/routing';
import Image from 'next/image';
import {
    Search,
    Calendar,
    PhoneCall,
    CheckCircle2,
    Sun,
    Snowflake,
    CloudSun,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const POPULAR_SIZES = [
    { label: "205/55 R16", width: "205", aspectRatio: "55", rimSize: "16" },
    { label: "225/45 R17", width: "225", aspectRatio: "45", rimSize: "17" },
    { label: "225/40 R18", width: "225", aspectRatio: "40", rimSize: "18" },
    { label: "195/65 R15", width: "195", aspectRatio: "65", rimSize: "15" },
];

const WIDTHS = [
    "155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305", "315"
];

const RATIOS = [
    "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80"
];

const RIMS = [
    "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"
];

export default function Hero() {
    const t = useTranslations('Hero');
    const router = useRouter();

    const [width, setWidth] = useState<string>("");
    const [aspectRatio, setAspectRatio] = useState<string>("");
    const [rimSize, setRimSize] = useState<string>("");
    const [season, setSeason] = useState<string>("all");
    const [condition, setCondition] = useState<string>("all");

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (width) params.set("width", width);
        if (aspectRatio) params.set("aspectRatio", aspectRatio);
        if (rimSize) params.set("rimSize", rimSize);
        if (season && season !== "all") params.set("season", season);
        if (condition && condition !== "all") params.set("condition", condition);

        const query = params.toString();
        router.push(query ? (`/tires?${query}` as any) : '/tires');
    };

    const handleQuickSize = (size: typeof POPULAR_SIZES[number]) => {
        const params = new URLSearchParams({
            width: size.width,
            aspectRatio: size.aspectRatio,
            rimSize: size.rimSize
        });
        router.push(`/tires?${params.toString()}` as any);
    };

    return (
        <section className="relative min-h-[640px] lg:min-h-[720px] py-16 sm:py-20 lg:py-24 overflow-hidden flex items-center justify-center bg-[#071324] text-white">
            {/* Background Image with Dark Blue Cinematic Gradients */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-workshop.jpg"
                    alt="Gent Bandenservice Professionele Werkplaats"
                    fill
                    priority
                    className="object-cover object-center scale-[1.02]"
                    quality={95}
                />
                {/* Dark Blue ambient radial glow */}
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#1E3E62]/30 rounded-full blur-[100px] pointer-events-none" />

                {/* Dark Blue Multi-stop Overlays for Crisp Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/98 via-[#0A1B30]/90 to-[#071324]/70 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-[#071324]/50 z-10" />
            </div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* LEFT COLUMN: Value Proposition & Branding */}
                    <div className="lg:col-span-7 text-left">
                        {/* Trust beacon */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-white text-xs md:text-sm font-semibold backdrop-blur-md shadow-lg mb-6">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span className="text-sky-300 font-bold">★ 4.9/5 Google Reviews</span>
                            <span className="text-white/40 hidden sm:inline">•</span>
                            <span className="hidden sm:inline text-white/90">Montage & Balanceren vanaf €25</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm">
                            Gent Bandenservice
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#2D7DC2] via-[#60A5FA] to-[#93C5FD]">
                                Uw Betrouwbare Bandencentrale
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl font-normal leading-relaxed">
                            {t('subtitle')}
                        </p>

                        {/* Key Feature Checkmarks */}
                        <div className="grid sm:grid-cols-3 gap-3 mb-8 text-xs sm:text-sm font-medium text-slate-200">
                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 backdrop-blur-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>Montage vanaf €25</span>
                            </div>
                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 backdrop-blur-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>Klaar terwijl u wacht</span>
                            </div>
                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 backdrop-blur-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>Ook mobiele service</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/tires"
                                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 text-base font-extrabold shadow-xl shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                id="hero-browse-tires-button"
                            >
                                <Search className="w-5 h-5" />
                                <span>{t('cta')}</span>
                            </Link>

                            <Link
                                href="/appointment"
                                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3.5 text-base font-semibold transition-all transform hover:-translate-y-0.5"
                                id="hero-appointment-button"
                            >
                                <Calendar className="w-5 h-5 text-sky-400" />
                                <span>{t('bookAppointment') || "Afspraak Maken"}</span>
                            </Link>

                            <a
                                href="tel:+32467871205"
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                            >
                                <PhoneCall className="w-4 h-4 text-primary animate-pulse" />
                                <span>0467 87 12 05</span>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Quick Tire Size Finder */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-3xl bg-[#0B1E36]/90 backdrop-blur-2xl border border-primary/30 p-6 sm:p-8 shadow-2xl shadow-black/80 text-white">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Snelle Bandenzoeker
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white">
                                        {t('quickFinderTitle') || "Vind Uw Bandenmaat"}
                                    </h2>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-4">
                                {/* Season Filter Tabs */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                                        Seizoen
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#061220]/80 border border-primary/20">
                                        <button
                                            type="button"
                                            onClick={() => setSeason("all")}
                                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                                season === "all"
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            Alle
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSeason("summer")}
                                            className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                                                season === "summer"
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <Sun className="w-3.5 h-3.5" />
                                            Zomer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSeason("winter")}
                                            className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                                                season === "winter"
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <Snowflake className="w-3.5 h-3.5" />
                                            Winter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSeason("all-season")}
                                            className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                                                season === "all-season"
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <CloudSun className="w-3.5 h-3.5" />
                                            4-Seiz.
                                        </button>
                                    </div>
                                </div>

                                {/* Dimension Dropdowns (3 columns) */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                                        Bandenmaat (Breedte / Hoogte / Inch)
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Width */}
                                        <div>
                                            <select
                                                value={width}
                                                onChange={(e) => setWidth(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-[#061220]/80 border border-primary/25 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                                id="hero-finder-width"
                                            >
                                                <option value="" className="bg-[#0B1E36] text-slate-300">Breedte</option>
                                                {WIDTHS.map((w) => (
                                                    <option key={w} value={w} className="bg-[#0B1E36] text-white">
                                                        {w}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Aspect Ratio */}
                                        <div>
                                            <select
                                                value={aspectRatio}
                                                onChange={(e) => setAspectRatio(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-[#061220]/80 border border-primary/25 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                                id="hero-finder-ratio"
                                            >
                                                <option value="" className="bg-[#0B1E36] text-slate-300">Hoogte</option>
                                                {RATIOS.map((r) => (
                                                    <option key={r} value={r} className="bg-[#0B1E36] text-white">
                                                        {r}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Rim Size */}
                                        <div>
                                            <select
                                                value={rimSize}
                                                onChange={(e) => setRimSize(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-[#061220]/80 border border-primary/25 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                                id="hero-finder-rim"
                                            >
                                                <option value="" className="bg-[#0B1E36] text-slate-300">Inch</option>
                                                {RIMS.map((rim) => (
                                                    <option key={rim} value={rim} className="bg-[#0B1E36] text-white">
                                                        {rim}&quot;
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Condition Toggle (Nieuw / Tweedehands) */}
                                <div>
                                    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#061220]/80 border border-primary/20 text-xs font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => setCondition("all")}
                                            className={`py-1.5 rounded-lg transition-all ${
                                                condition === "all"
                                                    ? "bg-primary text-white font-bold shadow-sm"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            Alle Banden
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCondition("new")}
                                            className={`py-1.5 rounded-lg transition-all ${
                                                condition === "new"
                                                    ? "bg-primary text-white font-bold shadow-sm"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            Nieuw
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCondition("used")}
                                            className={`py-1.5 rounded-lg transition-all ${
                                                condition === "used"
                                                    ? "bg-sky-500/25 text-sky-200 border border-sky-400/40 font-bold"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            Tweedehands
                                        </button>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm tracking-wide shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2"
                                    id="hero-finder-submit"
                                >
                                    <Search className="w-4 h-4 stroke-[2.5]" />
                                    <span>{t('searchTires') || "Zoek Banden"}</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                </button>
                            </form>

                            {/* Popular Size Shortcuts */}
                            <div className="mt-5 pt-4 border-t border-primary/20">
                                <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                                    {t('popularSizes') || "Populaire maten:"}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {POPULAR_SIZES.map((size) => (
                                        <button
                                            key={size.label}
                                            type="button"
                                            onClick={() => handleQuickSize(size)}
                                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-primary/30 hover:text-white border border-primary/20 transition-colors text-slate-300 cursor-pointer"
                                        >
                                            {size.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seamless Bottom Gradient Blend into WorkshopStrip */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/40 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
