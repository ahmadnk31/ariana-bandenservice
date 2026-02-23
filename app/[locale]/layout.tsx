import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Outfit, Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';
import { CartProvider } from '../components/CartContext';
import CartDrawer from '../components/CartDrawer';
import DevBanner from '../components/DevBanner';
import { getAlternateLanguages } from "@/lib/utils";
import CookieConsent from '../components/CookieConsent';
import AbandonedCheckoutHeartbeat from '../components/AbandonedCheckoutHeartbeat';

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const localeMap: Record<string, string> = {
    en: 'en_GB',
    nl: 'nl_NL',
    fr: 'fr_FR',
    de: 'de_DE',
    it: 'it_IT',
    es: 'es_ES',
    tr: 'tr_TR',
    pl: 'pl_PL',
    gr: 'el_GR',
    ar: 'ar_SA',
    fa: 'fa_IR',
    uk: 'uk_UA',
};

const supportedLocales = ['en', 'nl', 'fr', 'de', 'it', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    const title = metadata.title || "Gent Bandenservice | Gent Bandencentrale";
    const description = metadata.description || "Professionele bandenservice en autoreparatie in Gent.";
    const keywords = metadata.keywords || "";

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://gentbandenservice.be"),
        title: {
            default: title,
            template: "%s | Gent Bandenservice",
        },
        description,
        openGraph: {
            title,
            description,
            url: `https://gentbandenservice.be/${locale}`,
            siteName: "Gent Bandenservice",
            locale: localeMap[locale] || 'nl_NL',
            type: "website",
            images: [{ url: "/gentbandenservice/android-chrome-512x512.png", width: 512, height: 512, alt: "Gent Bandenservice Logo" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/gentbandenservice/android-chrome-512x512.png"],
        },
        icons: {
            icon: "/gentbandenservice/favicon.ico",
            shortcut: "/gentbandenservice/favicon-16x16.png",
            apple: "/gentbandenservice/apple-touch-icon.png",
        },
        keywords: keywords.split(',').map((k: string) => k.trim()),
        alternates: {
            languages: getAlternateLanguages(''),
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!supportedLocales.includes(locale)) notFound();
    const messages = await getMessages();

    // JSON-LD Structured Data for LocalBusiness
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "name": "Gent Bandenservice",
        "image": "https://gentbandenservice.be/gentbandenservice/android-chrome-512x512.png",
        "@id": "https://gentbandenservice.be",
        "url": "https://gentbandenservice.be",
        "telephone": "+32 466 19 56 22",
        "email": "contact@gentbandenservice.be",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Dendermondsesteenweg 428",
            "addressLocality": "Sint-Amandsberg",
            "postalCode": "9040",
            "addressCountry": "BE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.0566,
            "longitude": 3.7663
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "priceRange": "$$"
    };

    return (
        <html lang={locale} dir={['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr'}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${outfit.variable} ${inter.variable} antialiased font-sans`}>
                <NextIntlClientProvider messages={messages}>
                    <CartProvider>

                        {children}
                        <CartDrawer />
                        <CookieConsent />
                        <AbandonedCheckoutHeartbeat />
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
