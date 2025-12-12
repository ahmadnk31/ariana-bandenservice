"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import TireCard from "./TireCard";

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
    currentPage: number;
    totalPages: number;
    initialFilters: FilterState;
}

export default function TireFilters({ tires, currentPage, totalPages, initialFilters }: TireFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Debounce search and price updates
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const updateParams = useCallback((newFilters: Partial<FilterState>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Merge new filters with current params (but we prefer to rebuild from state + updates usually, 
        // here we map from the argument directly which is cleaner for individual updates)
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

        router.push(`/tires?${params.toString()}`, { scroll: false });
        setFilters(updated as FilterState);
    }, [filters, router, searchParams]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        updateParams({ [key]: value });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`/tires?${params.toString()}`, { scroll: true });
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
                        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                {/* Sidebar Filters */}
                <aside className={`w-full lg:w-64 flex-shrink-0 space-y-8 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Filters</h2>
                        <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-primary underline">
                            Clear All
                        </button>
                    </div>

                    {/* Search */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                placeholder="Search tires..."
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Condition</label>
                        <div className="flex flex-col gap-2">
                            {["all", "new", "used"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="condition"
                                        checked={filters.condition === opt}
                                        onChange={() => handleFilterChange("condition", opt)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm capitalize">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Season */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Season</label>
                        <div className="flex flex-col gap-2">
                            {["all", "summer", "winter", "all-season"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="season"
                                        checked={filters.season === opt}
                                        onChange={() => handleFilterChange("season", opt)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm capitalize">{opt === "all-season" ? "All-Season" : opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Price Range (€)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice || ""}
                                onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <span className="text-muted-foreground">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice || ""}
                                onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Dimensions</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                placeholder="Width"
                                value={filters.width || ""}
                                onChange={(e) => handleFilterChange("width", e.target.value ? Number(e.target.value) : null)}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Width (mm)"
                            />
                            <input
                                type="number"
                                placeholder="Ratio"
                                value={filters.aspectRatio || ""}
                                onChange={(e) => handleFilterChange("aspectRatio", e.target.value ? Number(e.target.value) : null)}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Aspect Ratio"
                            />
                            <input
                                type="number"
                                placeholder="Rim"
                                value={filters.rimSize || ""}
                                onChange={(e) => handleFilterChange("rimSize", e.target.value ? Number(e.target.value) : null)}
                                className="px-2 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                title="Rim Size (inch)"
                            />
                        </div>
                    </div>

                    {/* Brand (Simple Text Input for now, could be checkboxes if we fetch brands) */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Brand</label>
                        <input
                            type="text"
                            placeholder="e.g. Michelin"
                            value={filters.brand === "all" ? "" : filters.brand}
                            onChange={(e) => handleFilterChange("brand", e.target.value || "all")}
                            className="w-full px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Specs */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Specs</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Load Idx"
                                value={filters.loadIndex === "all" ? "" : filters.loadIndex}
                                onChange={(e) => handleFilterChange("loadIndex", e.target.value || "all")}
                                className="px-3 py-2 text-sm rounded-md border border-muted bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Speed"
                                value={filters.speedRating === "all" ? "" : filters.speedRating}
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
                            Found <strong>{tires.length}</strong> results (Total pages: {totalPages})
                        </p>
                        {/* Sort could go here */}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tires.map((tire) => (
                            <TireCard key={tire.id} {...tire} />
                        ))}
                    </div>

                    {tires.length === 0 && (
                        <div className="text-center py-20 bg-muted/30 rounded-lg border border-muted border-dashed">
                            <p className="text-muted-foreground">No tires found matching your criteria.</p>
                            <button onClick={clearFilters} className="mt-2 text-primary hover:underline">Clear all filters</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-muted hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-muted hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
