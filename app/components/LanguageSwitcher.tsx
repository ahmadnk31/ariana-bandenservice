"use client";

import { usePathname, useRouter } from "next/navigation";

const locales = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    // Extract current locale from pathname
    const currentLocale = pathname.split("/")[1] || "nl";

    const switchLocale = (newLocale: string) => {
        // Replace the locale segment in the pathname
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <div className="flex items-center gap-2">
            {locales.map((locale) => (
                <button
                    key={locale.code}
                    onClick={() => switchLocale(locale.code)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${currentLocale === locale.code
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                    aria-label={`Switch to ${locale.label}`}
                >
                    <span>{locale.flag}</span>
                    <span className="hidden sm:inline">{locale.code.toUpperCase()}</span>
                </button>
            ))}
        </div>
    );
}
