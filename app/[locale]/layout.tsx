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
import DevBanner from '../components/DevBanner';

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

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
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    const title = metadata.title || "Ariana Bandenservice | Bandencentrale Gent";
    const description = metadata.description || "Professionele bandenservice en autoreparatie in Gent.";
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
            description,
            url: `https://arianabandenservice.be/${locale}`,
            siteName: "Ariana Bandenservice",
            locale: localeMap[locale] || 'nl_NL',
            type: "website",
            images: [{ url: "/banden-service/android-chrome-512x512.png", width: 512, height: 512, alt: "Ariana Bandenservice Logo" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/banden-service/android-chrome-512x512.png"],
        },
        icons: {
            icon: "/banden-service/favicon.ico",
            shortcut: "/banden-service/favicon-16x16.png",
            apple: "/banden-service/apple-touch-icon.png",
        },
        keywords: keywords.split(',').map((k: string) => k.trim()),
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

    return (
        <html lang={locale} dir={['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr'}>
            <body className={`${outfit.variable} antialiased font-sans`}>
                <NextIntlClientProvider messages={messages}>
                    <CartProvider>
                        <DevBanner />
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
