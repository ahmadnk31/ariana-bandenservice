"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    brand: string;
    condition?: string;
    price: number;
    image?: string;
}

interface SearchOverlayProps {
    triggerType?: "icon" | "input";
}

export default function SearchOverlay({ triggerType = "icon" }: SearchOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('SearchOverlay');

    useEffect(() => {
        setMounted(true);
    }, []);

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
            if (query.length > 2) {
                setLoading(true);
                setPage(1);
                setHasMore(true);
                try {
                    const res = await fetch(`/api/tires/search?q=${encodeURIComponent(query)}&page=1&limit=10`);
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
    }, [query]);

    // Load more results
    const loadMore = async () => {
        if (!hasMore || loadingMore || loading) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/tires/search?q=${encodeURIComponent(query)}&page=${nextPage}&limit=10`);
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            setIsOpen(false);
            router.push(`/tires?search=${encodeURIComponent(query)}`);
        }
    };

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

            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Search Container */}
                    <div className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[600px] bg-card border border-muted rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <form onSubmit={handleSearch} className="flex items-center border-b border-muted p-4">
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
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="ml-4 px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded hover:bg-muted/80"
                            >
                                {t('close')}
                            </button>
                        </form>

                        {/* Results */}
                        {(results.length > 0 || loading) && (
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
                                                    <p className="text-sm text-muted-foreground">{result.brand}</p>
                                                </div>
                                                <div className="font-bold">€{result.price}</div>
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
                        )}

                        {query && results.length === 0 && !loading && (
                            <div className="p-8 text-center text-muted-foreground">
                                {t('noResults')}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
