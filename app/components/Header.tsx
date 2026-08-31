"use client";


import { useState } from "react";
import Image from "next/image";
import SearchOverlay from "./SearchOverlay";
import { useTranslations, useLocale } from 'next-intl';
import { Link } from "@/src/i18n/routing";
import CartButton from "./CartButton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const priceWarningFallbacks: Record<string, { warning: string; actionText: string; orText: string; appointmentText: string }> = {
    nl: {
        warning: "Sommige bandenprijzen kunnen veranderen. Voor meer duidelijkheid:",
        actionText: "stuur een bericht",
        orText: "of",
        appointmentText: "een afspraak maken"
    },
    en: {
        warning: "Some tire prices may change. For more clarity:",
        actionText: "send a message",
        orText: "or",
        appointmentText: "make an appointment"
    },
    fr: {
        warning: "Certains prix des pneus peuvent changer. Pour plus de clarté :",
        actionText: "envoyez un message",
        orText: "ou",
        appointmentText: "prenez rendez-vous"
    },
    de: {
        warning: "Einige Reifenpreise können sich ändern. Für mehr Klarheit:",
        actionText: "senden Sie eine Nachricht",
        orText: "oder",
        appointmentText: "einen Termin vereinbaren"
    },
    es: {
        warning: "Algunos precios de los neumáticos pueden cambiar. Para mayor claridad:",
        actionText: "envíe un mensaje",
        orText: "o",
        appointmentText: "reserve una cita"
    },
    it: {
        warning: "Alcuni prezzi dei pneumatici potrebbero variare. Per maggiore chiarezza:",
        actionText: "invia un messaggio",
        orText: "o",
        appointmentText: "fissa un appuntamento"
    },
    pl: {
        warning: "Niektóre ceny opon mogą ulec zmianie. Aby uzyskać więcej informacji:",
        actionText: "wyślij wiadomość",
        orText: "lub",
        appointmentText: "umów się na spotkanie"
    },
    tr: {
        warning: "Bazı lastik fiyatları değişebilir. Daha fazla bilgi için:",
        actionText: "mesaj gönderin",
        orText: "veya",
        appointmentText: "randevu alın"
    },
    uk: {
        warning: "Деякі ціни на шини можуть змінюватися. Для уточнення:",
        actionText: "надішліть повідомлення",
        orText: "або",
        appointmentText: "запишіться на прийом"
    },
    ar: {
        warning: "قد تتغير بعض أسعار الإطارات. لمزيد من الوضوح:",
        actionText: "أرسل رسالة",
        orText: "أو",
        appointmentText: "احجز موعدًا"
    },
    fa: {
        warning: "برخی از قیمت‌های لاستیک ممکن است تغییر کند. برای وضوح بیشتر:",
        actionText: "پیام بفرستید",
        orText: "یا",
        appointmentText: "نوبت بگیرید"
    },
    gr: {
        warning: "Ορισμένες τιμές ελαστικών ενδέχεται να αλλάξουν. Για περισσότερες λεπτομέρειες:",
        actionText: "στείλτε μήνυμα",
        orText: "ή",
        appointmentText: "κλείστε ραντεβού"
    }
};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = useTranslations('Header');
    const tTires = useTranslations('Tires');
    const locale = useLocale();
    const tWarning = priceWarningFallbacks[locale] || priceWarningFallbacks.nl;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Announcement Bar */}
            <div className="w-full bg-amber-500/10 dark:bg-amber-500/5 text-amber-800 dark:text-amber-300 py-1.5 px-4 text-center text-xs font-medium border-b border-muted transition-colors">
                <div className="container mx-auto flex items-center justify-center gap-1 flex-wrap">
                    <span>{tWarning.warning}</span>
                    <Link href="/contact" className="underline hover:text-amber-900 dark:hover:text-amber-200 transition-colors mx-0.5">
                        {tWarning.actionText}
                    </Link>
                    <span>{tWarning.orText}</span>
                    <Link href="/appointment" className="underline hover:text-amber-900 dark:hover:text-amber-200 transition-colors mx-0.5">
                        {tWarning.appointmentText}
                    </Link>
                </div>
            </div>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Left: Logo */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                            <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-cover" />
                        </div>
                        <span className="text-lg hidden lg:block font-bold uppercase tracking-tight text-foreground text-amber-700">
                            Gent <span className="text-primary text-amber-700">Bandenservice B.V.</span>
                        </span>
                    </Link>
                </div>
                {/* Center: Search Input (Desktop) */}
                <div className="hidden lg:flex flex-1 justify-center max-w-lg mx-4">
                    <div className="w-full">
                        <SearchOverlay triggerType="input" />
                    </div>
                </div>

                {/* Right: Navigation & Mobile Controls */}
                <div className="flex flex-1 items-center justify-end gap-3 lg:gap-6">
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/tires" className="text-sm font-semibold hover:text-primary transition-colors">
                            {t('tires')}
                        </Link>
                        <Link href="/services" className="text-sm font-semibold hover:text-primary transition-colors">
                            {t('services')}
                        </Link>
                        <Link href="/about" className="text-sm font-semibold hover:text-primary transition-colors">
                            {t('about')}
                        </Link>
                        <Link href="/contact" className="text-sm font-semibold hover:text-primary transition-colors">
                            {t('contact')}
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors focus:outline-none">
                                {t('more')}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2">
                                <DropdownMenuItem asChild>
                                    <Link href="/blog" className="w-full cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                        {t('blog')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/b2b" className="w-full cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                        {t('b2b')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/secondhand-tires" className="w-full cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                        {tTires('secondHand')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    <div className="flex items-center gap-2">
                        {/* Cart Button */}
                        <CartButton />

                        <div className="lg:hidden">
                            <SearchOverlay triggerType="icon" />
                        </div>

                        <button
                            className="lg:hidden p-2 text-foreground hover:bg-accent rounded-md transition-colors"
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
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[500px] border-t border-muted opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
                    <Link
                        href="/"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        href="/tires"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('tires')}
                    </Link>
                    <Link
                        href="/services"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('services')}
                    </Link>
                    <Link
                        href="/about"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href="/contact"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('contact')}
                    </Link>
                    <div className="h-px bg-muted mx-2 my-1" />
                    <Link
                        href="/blog"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('blog')}
                    </Link>
                    <Link
                        href="/b2b"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('b2b')}
                    </Link>
                    <Link
                        href="/secondhand-tires"
                        className="text-base font-medium hover:text-primary transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {tTires('secondHand')}
                    </Link>
                </nav>
            </div>
        </header>
    );
}