"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Image from 'next/image';

export default function Hero() {
    const t = useTranslations('Hero');
    const tHeader = useTranslations('Header');

    return (
        <section className="relative py-28 md:py-40 overflow-hidden flex items-center justify-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Premium Tire Service Center"
                    fill
                    priority
                    className="object-cover object-center"
                    quality={90}
                />
                {/* Dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/30 z-10" />
            </div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-semibold uppercase tracking-wider text-white">Premium Service</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
                        {t('title1')} <span className="text-primary drop-shadow-lg">{t('title2')}</span> <br className="hidden md:block" />
                        <span className="text-white/90">& {t('title3')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/tires" className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {t('cta')}
                        </Link>
                        <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-md border-2 border-white/20 bg-black/20 backdrop-blur-md px-8 text-base font-medium text-white shadow-sm transition-all hover:bg-white/10 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                            {tHeader('contact')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom fade to seamlessly blend into the next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
        </section>
    );
}
