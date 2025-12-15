import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Outfit } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import type { Metadata } from 'next';
import { CartProvider } from '../components/CartContext';
import { Analytics } from "@vercel/analytics/next"
import CartDrawer from '../components/CartDrawer';

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});
// Locale mapping for OpenGraph
const localeMap: Record<string, string> = {
    en: 'en_GB',
    nl: 'nl_NL',
    fr: 'fr_FR',
    es: 'es_ES',
    tr: 'tr_TR',
    pl: 'pl_PL',
    gr: 'el_GR',
    ar: 'ar_SA',
    fa: 'fa_IR',
    uk: 'uk_UA',
};

const supportedLocales = ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    // Load messages for the locale
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    const title = metadata.title || "Ariana Bandenservice | Bandencentrale Gent";
    const description = metadata.description || "Professionele bandenservice en autoreparatie in Gent.";
    const ogDescription = metadata.ogDescription || description;
    const keywords = metadata.keywords || "";

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://arianabandenservice.be"),
        title: {
            default: title,
            template: "%s | Ariana Bandenservice",
        },
        description,
        openGraph: {
            title,
            description: ogDescription,
            url: `https://arianabandenservice.be/${locale}`,
            siteName: "Ariana Bandenservice",
            locale: localeMap[locale] || 'nl_NL',
            type: "website",
            images: [
                {
                    url: "/banden-service/android-chrome-512x512.png",
                    width: 512,
                    height: 512,
                    alt: "Ariana Bandenservice Logo",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: ogDescription,
            images: ["/banden-service/android-chrome-512x512.png"],
        },
        icons: {
            icon: "/banden-service/favicon.ico",
            shortcut: "/banden-service/favicon-16x16.png",
            apple: "/banden-service/apple-touch-icon.png",
        },
        keywords: keywords.split(',').map((k: string) => k.trim()),
        alternates: {
            languages: Object.fromEntries(
                supportedLocales.map(loc => [loc, `/${loc}`])
            ),
        },
        category: 'automotive',
        other: {
            "geo.region": "BE-VOV",
            "geo.placename": "Sint-Amandsberg",
            "geo.position": "51.0667;3.7667",
            "ICBM": "51.0667, 3.7667"
        }
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

    // Verify locale
    if (!supportedLocales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["AutoRepair", "TireShop"],
        "name": "Ariana Bandenservice",
        "image": "https://arianabandenservice.be/banden-service/android-chrome-512x512.png",
        "description": "Professionele bandenservice en autoservice in Gent. Kwaliteit bandenmontage, uitlijning, balanceren en reparatie.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Dendermondsesteenweg 428",
            "addressLocality": "Sint-Amandsberg",
            "postalCode": "9040",
            "addressCountry": "BE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "51.0667",
            "longitude": "3.7667"
        },
        "url": "https://arianabandenservice.be",
        "telephone": "+32466195622",
        "priceRange": "$$"
    };

    // RTL languages
    const rtlLocales = ['ar', 'fa'];
    const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${outfit.variable} antialiased font-sans`}>
                <NextIntlClientProvider messages={messages}>
                    <CartProvider>
                        {children}
                        <CartDrawer />
                        <Analytics />
                    </CartProvider>
                </NextIntlClientProvider>
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
            </body>
        </html>
    );
}
