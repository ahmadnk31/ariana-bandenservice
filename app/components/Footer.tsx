"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { Feedback } from './Feedback';

export default function Footer() {
    const t = useTranslations('Footer');
    const cookieT = useTranslations('Cookie');
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="border-t border-muted bg-muted/50 py-12">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm border-b border-muted/50 pb-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">Gent bandenservice</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('aboutText')}
                    </p>
                    <a href="/b2b" className="text-primary font-medium hover:underline transition-all">
                        B2B / Insurance Partners
                    </a>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">{t('contact')}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>Dendermondsesteenweg 428,9040 {t('address')}</li>
                        <li>+32 466 19 56 22</li>
                        <li>info@gentbandenservice.be</li>
                        <li>
                            <a
                                href="https://www.google.com/maps/place/Gent+bandenservice/@51.0517705,3.7562035,17z/data=!4m8!3m7!1s0x47c3770072e640f9:0x174644c00e4bbfef!8m2!3d51.0517705!4d3.7562035!9m1!1b1!16s%2Fg%2F11xyq3j47q?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary transition-colors text-[#F59E0B]"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5l3.09 6.26L22 8.74l-5 4.87 1.18 6.88L12 17.25l-6.18 3.24L7 13.61l-5-4.87 6.91-0.98L12 1.5z" /></svg>
                                {useTranslations('Home')('reviews.reviewUs')}
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:text-primary transition-colors">{t('about')}</a>
                        </li>
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

            {/* Payment & Shipping */}
            <div className="container mx-auto px-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
                {/* Payment Methods */}
                <div className="flex flex-col items-center sm:items-start gap-2">
                    <span className="font-semibold text-foreground/70 uppercase tracking-wider">Payment</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { src: "/visa.png", alt: "Visa" },
                            { src: "/mastercard.png", alt: "Mastercard" },
                            { src: "/bancontact.png", alt: "Bancontact" },
                            { src: "/apply-pay.png", alt: "Apple Pay" },
                            { src: "/google-pay.png", alt: "Google Pay" },
                            { src: "/wero.png", alt: "Wero" },
                        ].map((method) => (
                            <span
                                key={method.alt}
                                className="inline-flex items-center justify-center h-11 px-2 bg-white border border-gray-200"
                                title={method.alt}
                            >
                                <Image
                                    src={method.src}
                                    alt={method.alt}
                                    width={48}
                                    height={30}
                                    className="object-contain h-8 w-auto"
                                />
                            </span>
                        ))}
                    </div>
                </div>
                {/* Shipping Partners */}
                <div className="flex flex-col items-center sm:items-end gap-2">
                    <span className="font-semibold text-foreground/70 uppercase tracking-wider">Shipping</span>
                    <div className="flex items-center gap-2">
                        {[
                            { src: "/dpd.png", alt: "DPD" },
                            { src: "/gls.png", alt: "GLS" },
                        ].map((partner) => (
                            <span
                                key={partner.alt}
                                className="inline-flex items-center justify-center h-11 px-3 bg-white border border-gray-200"
                                title={partner.alt}
                            >
                                <Image
                                    src={partner.src}
                                    alt={partner.alt}
                                    width={60}
                                    height={30}
                                    className="object-contain h-8 w-auto"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partner Badges */}
            <div className="container mx-auto px-4 mt-8 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <span className="font-semibold text-foreground/70 uppercase tracking-wider text-xs">Partners</span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <a
                            href="https://www.banden-pneus-online.be"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-11 px-3 bg-white border border-gray-200 hover:border-primary transition-colors"
                            title="Banden Pneus Online"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://cdn-img1.pneus-online.com/pol/logo_nl.png"
                                alt="Banden Pneus Online"
                                className="h-8 w-auto object-contain"
                            />
                        </a>
                        <a
                            href="https://www.bandenleader.be"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-11 px-3 bg-white border border-gray-200 hover:border-primary transition-colors"
                            title="Bandenleader.be montagepartnerstation"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://cdn.tiresleader.com/static/sites/bandenleader.be/img/banners/Banner_15.jpg"
                                alt="Bandenleader.be montagepartnerstation"
                                className="h-8 w-auto object-contain"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-muted/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
                <div className="flex flex-col items-center sm:items-start gap-4">
                    <p>&copy; {year || 2025} Gent bandenservice. {t('rights')}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs">
                        <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <span className="hidden sm:inline">•</span>
                        <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
                        <span className="hidden sm:inline">•</span>
                        <a href="/return-policy" className="hover:text-primary transition-colors">Return Policy</a>
                        <span className="hidden sm:inline">•</span>
                        <a href="/cookies" className="hover:text-primary transition-colors">{cookieT('policy')}</a>
                        <span className="hidden sm:inline">•</span>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new Event('cookie-consent-open'))}
                            className="hover:text-primary transition-colors"
                        >
                            {cookieT('manage')}
                        </button>
                    </div>
                    <Feedback />
                </div>
                <LanguageSwitcher />
            </div>
        </footer>
    );
}
