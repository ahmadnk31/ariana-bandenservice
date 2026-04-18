"use client";

import { useRouter, usePathname } from "@/src/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import TireCard from "./TireCard";
import { useTranslations } from 'next-intl';
import { Combobox } from "./ui/Combobox";

interface TireImage {
    id: string;
    url: string;
    key: string;
    order: number;
}

interface Tire {
    id: string;
    name: string;
    slug: string;
    brand: string;
    season: string;
    condition?: string;
    size: string;
    price: number;
    features: string[];
    images: TireImage[];
    stock?: number;
    inStock?: boolean;
    description?: string | null;
    width?: number | null;
    aspectRatio?: number | null;
    rimSize?: number | null;
    loadIndex?: string | null;
    speedRating?: string | null;
    efficiency?: string | null;
    grip?: string | null;
    noise?: string | null;
    noiseDb?: number | null;
}

interface FilterState {
    season: string;
    condition: string;
    search: string;
    brand: string;
    minPrice: number | null;
    maxPrice: number | null;
    width: number | null;
    aspectRatio: number | null;
    rimSize: number | null;
    loadIndex: string;
    speedRating: string;
}

interface TireFiltersProps {
    tires: Tire[];
    availableBrands: string[];
    currentPage: number;
    totalPages: number;
    initialFilters: FilterState;
    priceRange: { min: number; max: number };
}

import { DualRangeSlider } from "./ui/DualRangeSlider";
import { LayoutGrid, List, Filter } from "lucide-react";

export default function TireFilters({ tires, availableBrands, currentPage, totalPages, initialFilters, priceRange }: TireFiltersProps) {
    const t = useTranslations('Tires');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);

    const widthRef = useRef<HTMLInputElement>(null);
    const ratioRef = useRef<HTMLInputElement>(null);
    const rimRef = useRef<HTMLInputElement>(null);

    const updateParams = useCallback((newFilters: Partial<FilterState>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Merge new filters with current params
        const updated = { ...filters, ...newFilters };

        // Helper to set or delete param
        const set = (key: string, value: any) => {
            if (value === "all" || value === "" || value === null || value === 0) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        };

        set("season", updated.season);
        set("condition", updated.condition);
        set("search", updated.search);
        set("brand", updated.brand);
        set("minPrice", updated.minPrice);
        set("maxPrice", updated.maxPrice);
        set("width", updated.width);
        set("aspectRatio", updated.aspectRatio);
        set("rimSize", updated.rimSize);
        set("loadIndex", updated.loadIndex);
        set("speedRating", updated.speedRating);

        // Reset to page 1 on filter change
        if (newFilters && Object.keys(newFilters).length > 0) {
            params.set("page", "1");
        }

        router.push(`/tires?${params.toString()}` as any, { scroll: false });
        setFilters(updated as FilterState);
    }, [filters, router, searchParams]);

    // Handle immediate updates for selection-based filters
    useEffect(() => {
        // Only update URL for selection-based changes (not search/price which are debounced)
        const hasSelectionChange = localFilters.season !== filters.season ||
            localFilters.condition !== filters.condition ||
            localFilters.width !== filters.width ||
            localFilters.aspectRatio !== filters.aspectRatio ||
            localFilters.rimSize !== filters.rimSize ||
            localFilters.loadIndex !== filters.loadIndex ||
            localFilters.speedRating !== filters.speedRating;

        if (hasSelectionChange) {
            updateParams(localFilters);
        }
    }, [localFilters.season, localFilters.condition, localFilters.width, localFilters.aspectRatio, localFilters.rimSize, localFilters.loadIndex, localFilters.speedRating, updateParams]);

    // Debounce search and price updates
    // Sync local state when external filters change (e.g. from SearchOverlay or URL)
    useEffect(() => {
        setFilters(initialFilters);
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    // Debounce state updates to URL
    useEffect(() => {
        // Skip debouncing for clicks (Season, Condition) because they already trigger immediate updateParams
        // This effect mainly handles debouncing for typing fields
        const timer = setTimeout(() => {
            // Check if any "typing" fields actually changed relative to filters
            const typingFields: (keyof FilterState)[] = ['search', 'brand', 'minPrice', 'maxPrice', 'width', 'aspectRatio', 'rimSize', 'loadIndex', 'speedRating'];
            const hasChanged = typingFields.some(field => localFilters[field] !== filters[field]);

            if (hasChanged) {
                updateParams(localFilters);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localFilters, filters, updateParams]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        handleMultipleFiltersChange({ [key]: value });
    };

    const handleMultipleFiltersChange = (updates: Partial<FilterState>) => {
        setLocalFilters(prev => ({ ...prev, ...updates }));
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`/tires?${params.toString()}` as any, { scroll: true });
    };

    const clearFilters = () => {
        router.push("/tires");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        {mobileFiltersOpen ? t('filters') : t('filters')}
                    </button>
                </div>

                {/* Sidebar Filters */}
                <aside className={`w-full lg:w-64 flex-shrink-0 space-y-8 lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 ${mobileFiltersOpen ? "block" : "hidden lg:block"} ${!isFiltersVisible && "lg:hidden"}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{t('filters')}</h2>
                        <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-primary underline">
                            {t('clearAll')}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('searchPlaceholder')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localFilters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('condition')}</label>
                        <div className="flex flex-col gap-2">
                            {["all", "new", "used"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="condition"
                                        checked={localFilters.condition === opt}
                                        onChange={() => handleFilterChange("condition", opt)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm capitalize">{t(`conditions.${opt}` as any)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Season */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('season')}</label>
                        <div className="flex flex-col gap-2">
                            {["all", "summer", "winter", "all-season"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="season"
                                        checked={localFilters.season === opt}
                                        onChange={() => handleFilterChange("season", opt)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm capitalize">{t(`seasons.${opt}` as any)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-6">
                        <label className="text-sm font-medium">{t('price')} (€)</label>
                        <div className="px-2 pt-6 pb-2">
                            <DualRangeSlider
                                value={[
                                    localFilters.minPrice ?? priceRange.min,
                                    localFilters.maxPrice ?? priceRange.max
                                ]}
                                min={priceRange.min}
                                max={priceRange.max === priceRange.min ? priceRange.min + 100 : priceRange.max}
                                step={1}
                                labels={[t('min'), t('max')]}
                                onValueChange={(values) => {
                                    handleMultipleFiltersChange({
                                        minPrice: values[0],
                                        maxPrice: values[1]
                                    });
                                }}
                                minStepsBetweenThumbs={1}
                                label={(value) => `€${value}`}
                                labelPosition="top"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="flex-1 p-2 text-xs border border-muted rounded bg-muted/30 text-center">
                                {t('min')}: €{localFilters.minPrice ?? priceRange.min}
                            </div>
                            <span className="text-muted-foreground">-</span>
                            <div className="flex-1 p-2 text-xs border border-muted rounded bg-muted/30 text-center">
                                {t('max')}: €{localFilters.maxPrice ?? priceRange.max}
                            </div>
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('dimensions')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                ref={widthRef}
                                type="number"
                                placeholder={t('width')}
                                value={localFilters.width || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleFilterChange("width", val ? Number(val) : null);
                                    if (val.length === 3) {
                                        ratioRef.current?.focus();
                                    }
                                }}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Width (mm)"
                            />
                            <input
                                ref={ratioRef}
                                type="number"
                                placeholder={t('ratio')}
                                value={localFilters.aspectRatio || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleFilterChange("aspectRatio", val ? Number(val) : null);
                                    if (val.length === 2 && localFilters.aspectRatio?.toString().length !== 2) {
                                        rimRef.current?.focus();
                                    }
                                }}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Aspect Ratio"
                            />
                            <input
                                ref={rimRef}
                                type="number"
                                placeholder={t('rim')}
                                value={localFilters.rimSize || ""}
                                onChange={(e) => handleFilterChange("rimSize", e.target.value ? Number(e.target.value) : null)}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Rim Size (inch)"
                            />
                        </div>
                    </div>

                    {/* Brand */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('brand')}</label>
                        <Combobox
                            options={availableBrands}
                            value={localFilters.brand}
                            onChange={(value: string) => handleFilterChange("brand", value)}
                            placeholder={t('seasons.all')}
                            searchPlaceholder={t('searchPlaceholder')}
                            emptyMessage={t('noResults')}
                        />
                    </div>

                    {/* Specs */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t('specs')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder={t('loadIndex')}
                                value={localFilters.loadIndex === "all" ? "" : localFilters.loadIndex}
                                onChange={(e) => handleFilterChange("loadIndex", e.target.value || "all")}
                                className="px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder={t('speedRating')}
                                value={localFilters.speedRating === "all" ? "" : localFilters.speedRating}
                                onChange={(e) => handleFilterChange("speedRating", e.target.value || "all")}
                                className="px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {t('foundResults', { count: tires.length })} ({t('totalPages', { count: totalPages })})
                        </p>
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-muted">
                            <button
                                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${isFiltersVisible ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                title={isFiltersVisible ? "Hide Filters" : "Show Filters"}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-xs font-medium">{isFiltersVisible ? "Hide Filters" : "Show Filters"}</span>
                            </button>
                            <div className="hidden lg:block w-px h-4 bg-muted mx-1" />
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className={
                        viewMode === "grid"
                            ? `grid gap-2 ${isFiltersVisible ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`
                            : "flex flex-col gap-2"
                    }>
                        {tires.map((tire) => (
                            <TireCard key={tire.id} {...tire} viewMode={viewMode} />
                        ))}
                    </div>

                    {tires.length === 0 && (
                        <div className="text-center py-20 bg-muted/30 rounded-lg border border-muted border-dashed">
                            <p className="text-muted-foreground">{t('noResults')}</p>
                            <button onClick={clearFilters} className="mt-2 text-primary hover:underline">{t('clearFilters')}</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-12 pb-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-10 px-3 rounded-md border border-muted hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium"
                                aria-label="Previous page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                <span className="hidden sm:inline">Prev</span>
                            </button>

                            {/* Mobile: Show simple current/total */}
                            <div className="flex sm:hidden items-center px-4 text-sm font-medium border border-muted rounded-md h-10 bg-muted/20">
                                {currentPage} / {totalPages}
                            </div>

                            {/* Desktop/Tablet Pagination */}
                            <div className="hidden sm:flex items-center gap-2">
                                {(() => {
                                    const pages = [];
                                    const delta = 1; // Number of pages either side of current

                                    for (let i = 1; i <= totalPages; i++) {
                                        if (
                                            i === 1 ||
                                            i === totalPages ||
                                            (i >= currentPage - delta && i <= currentPage + delta)
                                        ) {
                                            if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                                                pages.push(-1); // -1 represents dots
                                            }
                                            pages.push(i);
                                        }
                                    }

                                    return pages.map((page, index) => (
                                        page === -1 ? (
                                            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${currentPage === page
                                                    ? "bg-primary text-primary-foreground"
                                                    : "border border-muted hover:bg-muted"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-10 px-3 rounded-md border border-muted hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium"
                                aria-label="Next page"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
