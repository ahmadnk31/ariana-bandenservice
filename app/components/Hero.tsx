"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export default function Hero() {
    const t = useTranslations('Hero');
    const tServices = useTranslations('Services');
    const tTires = useTranslations('Tires');

    return (
        <section className="relative py-20 md:py-32 overflow-hidden bg-muted">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        {t('title1')} <span className="text-primary">{t('title2')}</span> & {t('title3')}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        {t('subtitle')}
                    </p>
                    <div className="flex gap-4">
                        <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            {t('cta')}
                        </Link>
                        <Link href="/tires" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            {tTires('title')}
                        </Link>
                    </div>
                </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -z-10 h-full w-1/3 bg-gradient-to-l from-muted-foreground/10 to-transparent skew-x-12 translate-x-20"></div>
        </section>
    );
}
