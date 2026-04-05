"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import Price from '@/app/components/Price';
import SeasonIcon from '@/app/components/SeasonIcon';
import { getBrandLogo } from "@/lib/utils";

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    brand: string;
    size: string;
    condition?: string;
    season?: string;
    price: number;
    image?: string;
}

interface SearchOverlayProps {
    triggerType?: "icon" | "input";
}

export default function SearchOverlay({ triggerType = "icon" }: SearchOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchMode, setSearchMode] = useState<"general" | "size">("general");
    const [sizeWidth, setSizeWidth] = useState("");
    const [sizeRatio, setSizeRatio] = useState("");
    const [sizeRim, setSizeRim] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const widthRef = useRef<HTMLInputElement>(null);
    const ratioRef = useRef<HTMLInputElement>(null);
    const rimRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('SearchOverlay');
    const tiresT = useTranslations('Tires');

    useEffect(() => {
        setMounted(true);
    }, []);

    let activeQuery = query;
    if (searchMode === "size") {
        activeQuery = sizeWidth;
        if (sizeRatio) activeQuery += `/${sizeRatio}`;
        if (sizeRim) activeQuery += ` R${sizeRim}`;
        activeQuery = activeQuery.trim();
    }

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small timeout to ensure element is renderered in portal
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Initial search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (activeQuery.length > 2) {
                setLoading(true);
                setPage(1);
                setHasMore(true);
                try {
                    const res = await fetch(`/api/tires/search?q=${encodeURIComponent(activeQuery)}&page=1&limit=10`);
                    if (res.ok) {
                        const data = await res.json();
                        setResults(data);
                        if (data.length < 10) setHasMore(false);
                    }
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setHasMore(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [activeQuery]);

    // Load more results
    const loadMore = async () => {
        if (!hasMore || loadingMore || loading) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/tires/search?q=${encodeURIComponent(activeQuery)}&page=${nextPage}&limit=10`);
            if (res.ok) {
                const data = await res.json();
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setResults(prev => [...prev, ...data]);
                    setPage(nextPage);
                    if (data.length < 10) setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Failed to load more", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Scroll listener for infinite scroll
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            loadMore();
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsOpen(false);
        if (searchMode === "size") {
            const params = new URLSearchParams();
            if (sizeWidth) params.set("width", sizeWidth);
            if (sizeRatio) params.set("aspectRatio", sizeRatio);
            if (sizeRim) params.set("rimSize", sizeRim);
            router.push(`/tires?${params.toString()}`);
        } else if (query) {
            router.push(`/tires?search=${encodeURIComponent(query)}`);
        }
    };

    if (!mounted) {
        return (
            <>
                {triggerType === "input" ? (
                    <button
                        className="hidden md:flex items-center w-64 h-9 px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground transition-colors"
                        disabled
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span className="flex-1 text-left">{t('searchPlaceholder')}</span>
                    </button>
                ) : (
                    <button
                        className="p-2 text-muted-foreground transition-colors"
                        disabled
                        aria-label="Open search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                )}
            </>
        );
    }

    return (
        <>
            {triggerType === "input" ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="hidden md:flex items-center w-64 h-9 px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span className="flex-1 text-left">{t('searchPlaceholder')}</span>

                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Open search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            )}

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Search Container */}
                    <div className={`relative w-full max-w-2xl ${searchMode === "size" ? "max-h-[90vh] md:max-h-[800px]" : "max-h-[85vh] md:max-h-[600px]"} bg-card border border-muted rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col`}>
                        
                        {/* Search Toggles */}
                        <div className={`flex bg-muted/50 p-1 mx-4 mt-4 ${searchMode === "size" ? "mb-4" : ""} rounded-lg flex-shrink-0 relative z-20`}>
                            <button
                                type="button"
                                onClick={() => setSearchMode("general")}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${searchMode === "general" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {t('generalSearch')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchMode("size")}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${searchMode === "size" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {t('searchBySize')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="ml-2 px-3 text-muted-foreground hover:text-foreground bg-transparent border-l border-muted/50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {searchMode === "general" ? (
                            <form onSubmit={handleSearch} className="flex flex-shrink-0 items-center border-b border-muted/50 p-4 relative z-20 bg-card">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="flex-1 bg-transparent border-none text-lg outline-none placeholder:text-muted-foreground"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        className="p-1 text-muted-foreground hover:text-foreground"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </form>
                        ) : (
                            <div className="flex-shrink-0 relative overflow-hidden border-b border-muted min-h-[220px] sm:min-h-[280px] flex flex-col justify-center items-center bg-white dark:bg-[#1a1c23]">
                                <div 
                                    className="absolute left-1/2 -bottom-[40%] sm:-bottom-[60%] -translate-x-1/2 w-[180%] sm:w-[900px] aspect-square pointer-events-none opacity-15 dark:opacity-20 blend-luminosity"
                                    style={{
                                        backgroundImage: "url(/hero-tire.png)",
                                        backgroundSize: "100% auto",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "top center"
                                    }}
                                />
                                
                                <div className="flex items-end justify-center relative z-10 pt-6 sm:pt-10 pb-2 w-full px-4">
                                    <div className="flex flex-col items-center group">
                                        <input
                                            ref={widthRef}
                                            type="number"
                                            value={sizeWidth}
                                            onChange={(e) => {
                                                setSizeWidth(e.target.value);
                                                if(e.target.value.length === 3) ratioRef.current?.focus();
                                            }}
                                            placeholder="175"
                                            className="w-24 sm:w-40 text-center bg-transparent border-b-2 border-transparent focus:border-primary/50 text-primary font-black text-5xl sm:text-[80px] leading-none py-1 outline-none transition-all placeholder:text-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-[10px] sm:text-[12px] text-primary/60 uppercase tracking-widest font-bold mt-3 group-hover:text-primary transition-colors">{tiresT('width') || 'Width'}</span>
                                    </div>
                                    
                                    <span className="text-primary/40 font-light text-5xl sm:text-[80px] leading-none mb-7 sm:mb-8 mx-1 sm:mx-3">/</span>
                                    
                                    <div className="flex flex-col items-center group">
                                        <input
                                            ref={ratioRef}
                                            type="number"
                                            value={sizeRatio}
                                            onChange={(e) => {
                                                setSizeRatio(e.target.value);
                                                if(e.target.value.length === 2 && sizeRatio.length !== 2) rimRef.current?.focus();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !sizeRatio) widthRef.current?.focus();
                                            }}
                                            placeholder="55"
                                            className="w-20 sm:w-32 text-center bg-transparent border-b-2 border-transparent focus:border-primary/50 text-primary font-black text-5xl sm:text-[80px] leading-none py-1 outline-none transition-all placeholder:text-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-[10px] sm:text-[12px] text-primary/60 uppercase tracking-widest font-bold mt-3 group-hover:text-primary transition-colors">{tiresT('ratio') || 'Ratio'}</span>
                                    </div>
                                    
                                    <span className="text-primary font-black text-4xl sm:text-[60px] leading-none mb-7 sm:mb-8 mx-1 sm:mx-4 tracking-tighter">R</span>
                                    
                                    <div className="flex flex-col items-center group">
                                        <input
                                            ref={rimRef}
                                            type="number"
                                            value={sizeRim}
                                            onChange={(e) => setSizeRim(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !sizeRim) ratioRef.current?.focus();
                                            }}
                                            placeholder="20"
                                            className="w-20 sm:w-32 text-center bg-transparent border-b-2 border-transparent focus:border-primary/50 text-primary font-black text-5xl sm:text-[80px] leading-none py-1 outline-none transition-all placeholder:text-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-[10px] sm:text-[12px] text-primary/60 uppercase tracking-widest font-bold mt-3 group-hover:text-primary transition-colors">{tiresT('rim') || 'Rim'}</span>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-8 flex justify-center relative z-10 w-full mb-4">
                                    <button
                                        type="button"
                                        onClick={() => handleSearch()}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-10 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95 flex items-center gap-3 text-base sm:text-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        {t('searchBtn')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {(results.length > 0 || loading) ? (
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 min-h-0 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted"
                            >
                                {loading ? (
                                    <div className="p-4 text-center text-muted-foreground">{t('loading')}</div>
                                ) : (
                                    <>
                                        {results.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={`/tires/${result.slug}`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
                                            >
                                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {result.image ? (
                                                        <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium truncate group-hover:text-primary transition-colors">{result.name}</h4>
                                                        {result.condition === 'used' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider shrink-0">
                                                                {t('used')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {result.season && (
                                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                result.season === 'summer' ? 'bg-amber-500/10 text-amber-600 border border-amber-200/50' :
                                                                result.season === 'winter' ? 'bg-blue-500/10 text-blue-600 border border-blue-200/50' :
                                                                'bg-green-500/10 text-green-600 border border-green-200/50'
                                                            }`}>
                                                                <SeasonIcon season={result.season} size="sm" className="w-2.5 h-2.5" />
                                                                {result.season}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-1 py-0.5 rounded border border-muted/50 uppercase">
                                                            {result.size}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1.5">
                                                        {(() => {
                                                            const logo = getBrandLogo(result.brand);
                                                            return logo ? (
                                                                <div className="h-4 md:h-5 w-full flex justify-start">
                                                                    <img src={logo} alt={result.brand} className="h-full max-w-[80px] object-contain object-left" />
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{result.brand}</p>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                                <div><Price amount={result.price} size="base" /></div>
                                            </Link>
                                        ))}
                                        {loadingMore && (
                                            <div className="p-4 text-center text-muted-foreground animate-pulse">
                                                {t('loading')}...
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            activeQuery ? (
                                !loading && (
                                    <div className="p-8 text-center text-muted-foreground">
                                        {t('noResults')}
                                    </div>
                                )
                            ) : (
                                /* Helpful Empty State */
                                searchMode === "general" ? (
                                    <div className="flex-1 min-h-0 overflow-y-auto p-8 text-center bg-muted/10">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line></svg>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{(t as any)('howToFind') || "How to read your tire size?"}</h3>
                                        <p className="text-sm text-muted-foreground mb-6">{(t as any)('howToDesc') || "Look at the sidewall of your current tires to find these numbers:"}</p>
                                        
                                        <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm font-semibold max-w-sm mx-auto p-4 md:p-6 rounded-2xl bg-card border border-muted shadow-sm">
                                            <div className="text-center group">
                                                <div className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300">205</div>
                                                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Width</div>
                                            </div>
                                            <div className="text-xl sm:text-2xl text-muted-foreground font-light">/</div>
                                            <div className="text-center group">
                                                <div className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300">55</div>
                                                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Profile</div>
                                            </div>
                                            <div className="text-xl sm:text-2xl text-muted-foreground font-light">R</div>
                                            <div className="text-center group">
                                                <div className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300">16</div>
                                                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Rim Size</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                                            <button onClick={() => setQuery("205/55 R16")} className="px-3 py-1.5 text-xs font-medium bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 rounded-full border border-muted shadow-sm">Try "205/55 R16"</button>
                                            <button onClick={() => setQuery("225/45 R17")} className="px-3 py-1.5 text-xs font-medium bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 rounded-full border border-muted shadow-sm">Try "225/45 R17"</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 min-h-[0px] bg-muted/5"></div>
                                )
                            )
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
