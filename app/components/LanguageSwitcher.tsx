"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const locales = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "pl", label: "Polski", flag: "🇵🇱" },
    { code: "gr", label: "Ελληνικά", flag: "🇬🇷" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "fa", label: "فارسی", flag: "🇮🇷" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
];

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Extract current locale from pathname
    const currentLocale = pathname.split("/")[1] || "nl";
    const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[1];

    const switchLocale = (newLocale: string) => {
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors text-sm"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-lg">{currentLocaleData.flag}</span>
                <span className="hidden sm:inline">{currentLocaleData.code.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-48 max-h-64 overflow-y-auto bg-background border border-input rounded-md shadow-lg z-50">
                    {locales.map((locale) => (
                        <button
                            key={locale.code}
                            onClick={() => switchLocale(locale.code)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${currentLocale === locale.code
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            <span className="text-lg">{locale.flag}</span>
                            <span>{locale.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
