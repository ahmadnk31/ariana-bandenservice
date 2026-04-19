"use client";

import { useRouter, usePathname } from "@/src/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import TireCard from "./TireCard";
import { useTranslations } from 'next-intl';
import { Combobox } from "./ui/Combobox";
import { DualRangeSlider } from "./ui/DualRangeSlider";
import { LayoutGrid, List, Filter, LayoutTemplate, Sidebar as SidebarIcon, ChevronDown, ChevronUp, Search, X } from "lucide-react";

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
    features: string[];
}

interface TireFiltersProps {
    tires: Tire[];
    availableBrands: string[];
    availableLoadIndices: string[];
    availableSpeedRatings: string[];
    availableFeatures: string[];
    currentPage: number;
    totalPages: number;
    initialFilters: FilterState;
    priceRange: { min: number; max: number };
}


export default function TireFilters({ 
    tires, 
    availableBrands = [], 
    availableLoadIndices = [],
    availableSpeedRatings = [],
    availableFeatures = [],
    currentPage, 
    totalPages, 
    initialFilters, 
    priceRange 
}: TireFiltersProps) {
    const t = useTranslations('Tires');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [filterPosition, setFilterPosition] = useState<"top" | "side">("top");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

    const widthRef = useRef<HTMLInputElement>(null);
    const ratioRef = useRef<HTMLInputElement>(null);
    const rimRef = useRef<HTMLInputElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

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
        set("feature", updated.features.length > 0 ? updated.features.join(',') : "all");

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
            localFilters.speedRating !== filters.speedRating ||
            JSON.stringify(localFilters.features) !== JSON.stringify(filters.features);
            
        if (hasSelectionChange) {
            updateParams(localFilters);
        }
    }, [localFilters.season, localFilters.condition, localFilters.width, localFilters.aspectRatio, localFilters.rimSize, localFilters.loadIndex, localFilters.speedRating, localFilters.features, updateParams]);

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
        if (key === 'features') {
            const currentFeatures = [...localFilters.features];
            const featureValue = value as string;
            const index = currentFeatures.indexOf(featureValue);
            
            if (index > -1) {
                currentFeatures.splice(index, 1);
            } else {
                currentFeatures.push(featureValue);
            }
            
            setLocalFilters(prev => ({ ...prev, features: currentFeatures }));
            return;
        }
        
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

    const renderFilterTitle = () => (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                {t('filters')}
            </h2>
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                {t('clearAll')}
            </button>
        </div>
    );

    const renderDimensionInputs = (className = "") => (
        <div className={`grid grid-cols-3 gap-2 ${className}`}>
            <div className="relative group">
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
                    className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all group-hover:border-primary/50"
                    title="Width (mm)"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">mm</span>
            </div>
            <div className="relative group">
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
                    className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all group-hover:border-primary/50"
                    title="Aspect Ratio"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">%</span>
            </div>
            <div className="relative group">
                <input
                    ref={rimRef}
                    type="number"
                    placeholder={t('rim')}
                    value={localFilters.rimSize || ""}
                    onChange={(e) => handleFilterChange("rimSize", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all group-hover:border-primary/50"
                    title="Rim Size (inch)"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">"</span>
            </div>
        </div>
    );

    const renderBrandInput = () => (
        <Combobox
            options={availableBrands}
            value={localFilters.brand}
            onChange={(value: string) => handleFilterChange("brand", value)}
            placeholder={t('seasons.all')}
            searchPlaceholder={t('searchPlaceholder')}
            emptyMessage={t('noResults')}
        />
    );

    const renderPriceInput = () => (
        <div className="space-y-6">
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
            <div className="flex items-center gap-2">
                <div className="flex-1 p-2 text-xs border border-muted rounded bg-muted/30 text-center font-medium">
                    €{localFilters.minPrice ?? priceRange.min}
                </div>
                <span className="text-muted-foreground text-xs font-bold">—</span>
                <div className="flex-1 p-2 text-xs border border-muted rounded bg-muted/30 text-center font-medium">
                    €{localFilters.maxPrice ?? priceRange.max}
                </div>
            </div>
        </div>
    );

    const renderConditionInput = () => (
        <div className="relative w-full">
            <select
                value={localFilters.condition}
                onChange={(e) => handleFilterChange("condition", e.target.value)}
                className="w-full h-10 appearance-none bg-background border border-muted rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
                {["all", "new", "used"].map((opt) => (
                    <option key={opt} value={opt}>
                        {t(`conditions.${opt}` as any)}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
        </div>
    );

    const renderSeasonInput = () => (
        <div className="relative w-full">
            <select
                value={localFilters.season}
                onChange={(e) => handleFilterChange("season", e.target.value)}
                className="w-full h-10 appearance-none bg-background border border-muted rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
                {["all", "summer", "winter", "all-season"].map((opt) => (
                    <option key={opt} value={opt}>
                        {t(`seasons.${opt}` as any)}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
        </div>
    );

    const renderFeaturesInput = () => (
        <div className="relative" ref={featuresRef}>
            <button
                type="button"
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className={`w-full h-10 flex items-center justify-between bg-background border border-muted rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all ${isFeaturesOpen ? 'ring-1 ring-primary border-primary' : ''}`}
            >
                <span className="truncate">
                    {localFilters.features.length === 0 
                        ? t('features') 
                        : localFilters.features.join(', ')}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFeaturesOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-[100] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                    <div className="p-2 space-y-1">
                        {localFilters.features.length > 0 && (
                            <button
                                onClick={() => setLocalFilters(prev => ({ ...prev, features: [] }))}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-md transition-colors border-b border-muted/50 mb-1"
                            >
                                {t('clearAll')}
                            </button>
                        )}
                        {availableFeatures.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-muted-foreground italic">No features available</p>
                        ) : (
                            availableFeatures.map((f) => {
                                const isSelected = localFilters.features.includes(f);
                                return (
                                    <label
                                        key={f}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                                            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isSelected}
                                            onChange={() => handleFilterChange("features", f)}
                                        />
                                        <span className="text-sm truncate">{f}</span>
                                    </label>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderSpecInputs = () => (
        <div className="grid grid-cols-2 gap-2">
            <div className="relative">
                <select
                    value={localFilters.loadIndex}
                    onChange={(e) => handleFilterChange("loadIndex", e.target.value)}
                    className="w-full h-10 appearance-none bg-background border border-muted rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-8"
                >
                    <option value="all">{t('loadIndex')}</option>
                    {availableLoadIndices.map((idx) => (
                        <option key={idx} value={idx!}>{idx}</option>
                    ))}
                    {localFilters.loadIndex !== "all" && !availableLoadIndices.includes(localFilters.loadIndex) && (
                        <option value={localFilters.loadIndex}>{localFilters.loadIndex}</option>
                    )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
            </div>

            <div className="relative">
                <select
                    value={localFilters.speedRating}
                    onChange={(e) => handleFilterChange("speedRating", e.target.value)}
                    className="w-full h-10 appearance-none bg-background border border-muted rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-8"
                >
                    <option value="all">{t('speedRating')}</option>
                    {availableSpeedRatings.map((rating) => (
                        <option key={rating} value={rating!}>{rating}</option>
                    ))}
                    {localFilters.speedRating !== "all" && !availableSpeedRatings.includes(localFilters.speedRating) && (
                        <option value={localFilters.speedRating}>{localFilters.speedRating}</option>
                    )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
            </div>
        </div>
    );

    const renderLayoutToggles = () => (
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-muted ml-auto">
            <button
                onClick={() => setFilterPosition("top")}
                className={`p-1.5 rounded-md transition-all ${filterPosition === "top" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                title="Top Bar Filter"
            >
                <LayoutTemplate className="w-4 h-4" />
            </button>
            <button
                onClick={() => setFilterPosition("side")}
                className={`p-1.5 rounded-md transition-all ${filterPosition === "side" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                title="Sidebar Filter"
            >
                <SidebarIcon className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={`flex flex-col ${filterPosition === "side" ? "lg:flex-row" : ""} gap-8`}>

                {/* Layout and Mobile Toggles */}
                <div className="flex items-center justify-between gap-4 lg:hidden">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                        <Filter className="w-5 h-5" />
                        {t('filters')}
                    </button>
                    {renderLayoutToggles()}
                </div>

                {/* Top Bar Layout */}
                {filterPosition === "top" && (
                    <div className={`relative z-40 hidden lg:block w-full space-y-4 ${!isFiltersVisible && "hidden"}`}>
                        <div className="bg-background border border-muted rounded-2xl shadow-xl shadow-muted/20">
                            <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold uppercase tracking-wider">{t('filters')}</h2>
                                        <p className="text-[10px] opacity-80 font-medium">{tires.length} {t('foundResults', { count: tires.length }).split(' ')[1] || 'tires'} available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-bold uppercase tracking-widest hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                                    >
                                        {t('clearAll')}
                                    </button>
                                    {renderLayoutToggles()}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-end">
                                    {/* Dimensions Group */}
                                    <div className="lg:col-span-5 space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('dimensions')}</label>
                                        {renderDimensionInputs()}
                                    </div>

                                    {/* Brand Group */}
                                    <div className="lg:col-span-4 space-y-2 relative z-50">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('brand')}</label>
                                        {renderBrandInput()}
                                    </div>

                                    {/* Features Group */}
                                    <div className="lg:col-span-3 space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('features')}</label>
                                        {renderFeaturesInput()}
                                    </div>
                                </div>

                                <div className={`grid transition-all duration-500 ease-in-out ${isAdvancedOpen ? "grid-rows-[1fr] mt-8 opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                                    <div className="overflow-hidden">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4 border-t border-muted/50">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('price')} (€)</label>
                                                {renderPriceInput()}
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('season')}</label>
                                                    {renderSeasonInput()}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('condition')}</label>
                                                    {renderConditionInput()}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('specs')}</label>
                                                {renderSpecInputs()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group"
                                    >
                                        {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" /> : <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />}
                                        {isAdvancedOpen ? "Show Less" : "Show Advanced Filters"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sidebar Filters */}
                {filterPosition === "side" && (
                    <aside className={`w-full lg:w-72 flex-shrink-0 space-y-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20 ${mobileFiltersOpen ? "block" : "hidden lg:block"} ${!isFiltersVisible && "lg:hidden"}`}>
                        <div className="bg-background border border-muted rounded-2xl p-6 shadow-xl shadow-muted/5">
                            <div className="flex items-center justify-between mb-8">
                                {renderFilterTitle()}
                                <div className="hidden lg:block">
                                    {renderLayoutToggles()}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Search */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('searchPlaceholder')}</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={localFilters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            placeholder={t('searchPlaceholder')}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all group-hover:border-primary/50"
                                        />
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>

                                {/* Condition */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('condition')}</label>
                                    {renderConditionInput()}
                                </div>

                                {/* Season */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('season')}</label>
                                    {renderSeasonInput()}
                                </div>

                                {/* Price Range */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('price')} (€)</label>
                                    {renderPriceInput()}
                                </div>

                                {/* Dimensions */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('dimensions')}</label>
                                    {renderDimensionInputs()}
                                </div>

                                {/* Brand */}
                                <div className="space-y-3 relative z-50">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('brand')}</label>
                                    {renderBrandInput()}
                                </div>

                                {/* Specs */}
                                <div className="space-y-3 pb-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('specs')}</label>
                                    {renderSpecInputs()}
                                </div>

                                {/* Features */}
                                <div className="space-y-3 pb-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('features')}</label>
                                    {renderFeaturesInput()}
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-2xl border border-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <LayoutGrid className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                                <span className="text-primary font-bold">{tires.length}</span> {t('foundResults', { count: tires.length }).split(' ')[1] || 'tires'}
                                <span className="text-muted-foreground ml-2 text-xs font-normal">Page {currentPage} of {totalPages}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {filterPosition === "top" && renderLayoutToggles()}
                            <div className="w-px h-6 bg-muted mx-2 hidden sm:block" />
                            <div className="flex items-center gap-1.5 p-1 bg-background rounded-xl border border-muted shadow-sm">
                                <button
                                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                    className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isFiltersVisible ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"}`}
                                    title={isFiltersVisible ? "Hide Filters" : "Show Filters"}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{isFiltersVisible ? "Hide" : "Show"}</span>
                                </button>
                                <div className="hidden lg:block w-px h-4 bg-muted mx-1" />
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"}`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={
                        viewMode === "grid"
                            ? `grid gap-6 ${isFiltersVisible && filterPosition === "side" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`
                            : "flex flex-col gap-6"
                    }>
                        {tires.map((tire) => (
                            <TireCard key={tire.id} {...tire} viewMode={viewMode} />
                        ))}
                    </div>

                    {tires.length === 0 && (
                        <div className="text-center py-32 bg-muted/5 rounded-[2rem] border-2 border-muted border-dashed flex flex-col items-center justify-center gap-4">
                            <div className="bg-muted p-6 rounded-full">
                                <Search className="w-12 h-12 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-bold text-foreground">{t('noResults')}</p>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('clearFilters')}
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-3 mt-20 pb-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-12 px-5 rounded-xl border border-muted hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold uppercase tracking-widest active:scale-95"
                                aria-label="Previous page"
                            >
                                <ChevronDown className="w-4 h-4 rotate-90" />
                                <span className="hidden sm:inline">Prev</span>
                            </button>

                            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-2xl">
                                {(() => {
                                    const pages = [];
                                    const delta = 1;

                                    for (let i = 1; i <= totalPages; i++) {
                                        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                                            if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                                                pages.push(-1);
                                            }
                                            pages.push(i);
                                        }
                                    }

                                    return pages.map((page, index) => (
                                        page === -1 ? (
                                            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground font-bold">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all active:scale-90 ${currentPage === page
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                                                    : "hover:bg-background hover:shadow-sm"
                                                    }`}
                                            >
                                                {page < 10 ? `0${page}` : page}
                                            </button>
                                        )
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-12 px-5 rounded-xl border border-muted hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold uppercase tracking-widest active:scale-95"
                                aria-label="Next page"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronDown className="w-4 h-4 -rotate-90" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Modal-like Filter (Simplified) */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden bg-background">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-6 border-b border-muted">
                            <h2 className="text-xl font-black uppercase tracking-[0.2em]">{t('filters')}</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-muted rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('dimensions')}</label>
                                {renderDimensionInputs()}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('brand')}</label>
                                {renderBrandInput()}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('price')}</label>
                                {renderPriceInput()}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('season')}</label>
                                {renderSeasonInput()}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('condition')}</label>
                                {renderConditionInput()}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('specs')}</label>
                                {renderSpecInputs()}
                            </div>
                            <div className="space-y-4 pb-12">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('features')}</label>
                                {renderFeaturesInput()}
                            </div>
                        </div>
                        <div className="p-6 border-t border-muted bg-muted/20">
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
