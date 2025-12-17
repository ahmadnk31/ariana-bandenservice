"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
    const t = useTranslations('Footer');
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="border-t border-muted bg-muted/50 py-12">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
                <div>
                    <h3 className="font-bold text-lg mb-4">Ariana Bandenservice</h3>
                    <p className="text-muted-foreground">
                        {t('aboutText')}
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">{t('contact')}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>Dendermondsesteenweg 428,9040 {t('address')}</li>
                        <li>+32 466 19 56 22</li>
                        <li>info@arianabandenservice.be</li>
                        <li>
                            <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">{t('openingHours')}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>{t('openingHoursText')}</li>
                        <li>{t('openingHoursText2')}</li>

                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-muted/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
                <p>&copy; {year || 2025} Ariana Bandenservice. {t('rights')}</p>
                <LanguageSwitcher />
            </div>
        </footer>
    );
}
