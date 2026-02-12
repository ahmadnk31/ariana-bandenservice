'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

type ConsentValue = 'accepted' | 'rejected' | null;

const CONSENT_KEY = 'cookie-consent';

export default function CookieConsent() {
    const t = useTranslations('Cookie');
    const [consent, setConsent] = useState<ConsentValue>(null);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored === 'accepted' || stored === 'rejected') {
            setConsent(stored);
        }
    }, []);

    useEffect(() => {
        const handleOpen = () => {
            localStorage.removeItem(CONSENT_KEY);
            setConsent(null);
        };

        window.addEventListener('cookie-consent-open', handleOpen);
        return () => {
            window.removeEventListener('cookie-consent-open', handleOpen);
        };
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setConsent('accepted');
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, 'rejected');
        setConsent('rejected');
    };

    return (
        <>
            {consent === 'accepted' && (
                <>
                    <Analytics />
                    <Script id="tawk-to" strategy="afterInteractive">
                        {`
                            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                            (function(){
                            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                            s1.async=true;
                            s1.src='https://embed.tawk.to/693f1f214f7afe19760b416b/1jcf936kq';
                            s1.charset='UTF-8';
                            s1.setAttribute('crossorigin','*');
                            s0.parentNode.insertBefore(s1,s0);
                            })();
                        `}
                    </Script>
                </>
            )}

            {consent === null && (
                <div className="fixed bottom-0 inset-x-0 z-50 border-t border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-muted-foreground">
                            <p className="font-semibold text-foreground">{t('title')}</p>
                            <p>{t('description')} <Link href="/cookies" className="underline hover:text-primary">{t('policy')}</Link>.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="px-4 py-2 text-sm font-medium border border-muted rounded-md hover:border-primary hover:text-primary transition-colors"
                                onClick={handleReject}
                                type="button"
                            >
                                {t('reject')}
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                onClick={handleAccept}
                                type="button"
                            >
                                {t('accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
