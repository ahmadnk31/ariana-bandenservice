"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Left: Logo */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/icon.png" alt="Logo" width={50} height={50} />
                        <span className="text-xl hidden lg:block font-bold uppercase tracking-wider text-foreground">
                            Ariana <span className="text-primary">Bandenservice</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Search Input (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center max-w-lg mx-4">
                    <div className="w-full">
                        <SearchOverlay triggerType="input" />
                    </div>
                </div>

                {/* Right: Navigation & Mobile Controls */}
                <div className="flex-1 flex items-center justify-end gap-6">
                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
                            Services
                        </Link>
                        <Link href="/tires" className="text-sm font-medium hover:text-primary transition-colors">
                            Tires
                        </Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <div className="md:hidden">
                        <SearchOverlay triggerType="icon" />
                    </div>

                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-80 border-t border-muted" : "max-h-0"
                    }`}
            >
                <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                    <Link
                        href="/"
                        className="text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/services"
                        className="text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Services
                    </Link>
                    <Link
                        href="/tires"
                        className="text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Tires
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}
