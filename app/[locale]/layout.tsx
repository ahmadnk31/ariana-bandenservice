import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Outfit } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import type { Metadata } from 'next';
import { CartProvider } from '../components/CartContext';
import CartDrawer from '../components/CartDrawer';

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});



export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://arianabandenservice.be"),
    title: {
        default: "Ariana Bandenservice | Bandencentrale Gent",
        template: "%s | Ariana Bandenservice",
    },
    description: "Professionele bandenservice en autoreparatie in Gent. Kwaliteit bandenmontage, uitlijning, balanceren en reparatie. Topmerken tegen scherpe prijzen.",
    openGraph: {
        title: "Ariana Bandenservice | Bandencentrale Gent",
        description: "Professionele bandenservice en autoreparatie in Gent. Kwaliteit bandenmontage, uitlijning, balanceren en reparatie.",
        url: "https://arianabandenservice.be",
        siteName: "Ariana Bandenservice",
        locale: "nl_NL",
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
        title: "Ariana Bandenservice | Bandencentrale Gent",
        description: "Professionele bandenservice en autoreparatie in Gent. Topmerken tegen scherpe prijzen.",
        images: ["/banden-service/android-chrome-512x512.png"],
    },
    icons: {
        icon: "/banden-service/favicon.ico",
        shortcut: "/banden-service/favicon-16x16.png",
        apple: "/banden-service/apple-touch-icon.png",
    },
    keywords: [
        "bandenservice", "autoservice", "bandencentrale", "banden kopen", "wieluitlijning",
        "tire service", "car repair", "tire shop", "Gent", "Sint-Amandsberg", "9040",
        "autobanden", "winterbanden", "zomerbanden", "tweedehands banden"
    ],
    alternates: {
        languages: {
            'en': '/en',
            'nl': '/nl',
        },
    },
    category: 'automotive',
    other: {
        "geo.region": "BE-VOV",
        "geo.placename": "Sint-Amandsberg",
        "geo.position": "51.0667;3.7667",
        "ICBM": "51.0667, 3.7667"
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Verify locale
    if (!['en', 'nl'].includes(locale as any)) {
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

    return (
        <html lang={locale}>
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
