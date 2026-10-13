import { Metadata } from "next";
import Image from "next/image";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Link } from "@/src/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
    Truck,
    Wrench,
    Clock,
    ShieldCheck,
    PhoneCall,
    MapPin,
    RotateCw,
    CheckCircle2,
    Calendar,
    Zap,
    Euro,
    AlertCircle,
    HelpCircle,
    ArrowRight
} from "lucide-react";

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    const title = metadata.mobileTitle || "Mobiele Bandencentrale Gent | Banden Monteren & Repareren op Locatie";
    const description = metadata.mobileDescription || "Mobiele bandencentrale in Gent & Oost-Vlaanderen. Bandenwissel, lekke band reparatie en montage bij u thuis of op het werk. Binnen 30-60 min bij pech!";

    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}/mobile`,
            languages: getAlternateLanguages('/mobile'),
        },
        openGraph: {
            title,
            description,
            url: `/${locale}/mobile`,
            siteName: "Gent Bandenservice",
            images: [
                {
                    url: "/mobile-tire-service.jpg",
                    width: 1200,
                    height: 675,
                    alt: "Gent Bandenservice Mobiele Bandencentrale",
                },
            ],
            type: "website",
        },
    };
}

export default async function MobilePage() {
    const t = await getTranslations("Mobile");

    const coverageCities = [
        "Gent (Centrum)",
        "Sint-Amandsberg",
        "Oostakker",
        "Destelbergen",
        "Lochristi",
        "Gentbrugge",
        "Ledeberg",
        "Wondelgem",
        "Mariakerke",
        "Drongen",
        "Merelbeke",
        "Melle",
        "Sint-Denijs-Westrem",
        "Evergem",
        "De Pinte",
        "Zelzate",
        "Oost-Vlaanderen"
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "name": "Gent Bandenservice - Mobiele Bandencentrale",
        "description": "Professionele mobiele bandencentrale en pechverhelping op locatie in Gent en Oost-Vlaanderen.",
        "telephone": "+32467871205",
        "url": "https://gentbandenservice.be/mobiel",
        "image": "https://gentbandenservice.be/mobile-tire-service.jpg",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Dendermondsesteenweg 428",
            "addressLocality": "Sint-Amandsberg",
            "postalCode": "9040",
            "addressCountry": "BE"
        },
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Gent en Oost-Vlaanderen"
        },
        "openingHours": "Mo-Sa 08:00-19:00",
        "priceRange": "€€"
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header />

            <main className="flex-1">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 lg:py-24 border-b border-border">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/15 blur-3xl pointer-events-none rounded-full" />

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Status Live Dispatch Badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-semibold shadow-sm backdrop-blur">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                {t("statusActive")}
                            </div>
                        </div>

                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <span className="text-xs uppercase font-extrabold tracking-widest text-primary mb-3 block">
                                {t("badge")}
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground mb-6">
                                {t("title")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-600 to-sky-400 block mt-2">
                                    {t("titleHighlight")}
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                {t("subtitle")}
                            </p>

                            {/* Direct Action Buttons */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="tel:+32467871205"
                                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base"
                                    id="mobile-hero-call-button"
                                >
                                    <PhoneCall className="w-5 h-5 animate-pulse" />
                                    <span>{t("callNow")}</span>
                                </a>

                                <a
                                    href="https://wa.me/32467871205?text=Hallo%2C%20ik%20heb%20hulp%20nodig%20van%20de%20mobiele%20bandencentrale."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base"
                                    id="mobile-hero-whatsapp-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                    </svg>
                                    <span>{t("whatsapp")}</span>
                                </a>

                                <Link
                                    href={{ pathname: "/appointment" }}
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-input bg-card hover:bg-accent text-foreground font-semibold shadow-sm transition-all"
                                    id="mobile-hero-appointment-button"
                                >
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>{t("bookAppointment")}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Visual Card: Van & Service Showcase */}
                        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-card group">
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src="/mobile-tire-service.jpg"
                                    alt="Mobiele Bandencentrale Servicewagen Gent"
                                    fill
                                    priority
                                    className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                                {/* Floating Banner on Image */}
                                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex flex-wrap items-center justify-between gap-4 text-white">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider mb-2 shadow-md">
                                            <Truck className="w-3.5 h-3.5" />
                                            {t("equipmentTag")}
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold drop-shadow">
                                            Gent Bandenservice op Wielen
                                        </h2>
                                        <p className="text-sm md:text-base text-gray-200 drop-shadow line-clamp-1">
                                            Dendermondsesteenweg 428, Sint-Amandsberg & mobiel in heel regio Gent
                                        </p>
                                    </div>

                                    <a
                                        href="tel:+32467871205"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-colors text-sm shadow-md"
                                    >
                                        <PhoneCall className="w-4 h-4 text-primary" />
                                        +32 467 87 12 05
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-8">
                            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
                                <div className="text-2xl md:text-3xl font-black text-primary mb-1">
                                    30-60m
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {t("dispatchTime")}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
                                <div className="text-2xl md:text-3xl font-black text-foreground mb-1">
                                    100%
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {t("equipmentTag")}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
                                <div className="text-2xl md:text-3xl font-black text-primary mb-1">
                                    €25
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {t("priceTag")}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
                                <div className="text-2xl md:text-3xl font-black text-foreground mb-1">
                                    4.9 ★
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {t("ratingTag")}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EMERGENCY CALLOUT STRIP */}
                <section className="bg-primary py-6 text-white font-semibold shadow-inner">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-center md:text-left">
                            <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6 animate-bounce text-sky-400" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">
                                    {t("emergencyTitle")}
                                </h3>
                                <p className="text-sm text-sky-100 font-medium">
                                    {t("emergencyDesc")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="tel:+32467871205"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-900 transition-colors shadow-md text-sm"
                            >
                                <PhoneCall className="w-4 h-4 text-sky-400" />
                                {t("callNow")}
                            </a>
                            <a
                                href="https://wa.me/32467871205"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-gray-100 transition-colors text-sm"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* BENEFITS / VOORDELEN */}
                <section className="py-20 bg-background border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                {t("whyTitle")}
                            </h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {t("whySubtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <Clock className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b1Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b1Desc")}
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <Truck className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b2Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b2Desc")}
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b3Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b3Desc")}
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <Wrench className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b4Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b4Desc")}
                                </p>
                            </div>

                            {/* Card 5 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b5Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b5Desc")}
                                </p>
                            </div>

                            {/* Card 6 */}
                            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <RotateCw className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t("benefits.b6Title")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {t("benefits.b6Desc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS / HOE WERKT HET */}
                <section className="py-20 bg-muted/40 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                {t("howTitle")}
                            </h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {t("howSubtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            {/* Step 1 */}
                            <div className="relative p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                                <div>
                                    <div className="text-4xl font-black text-primary/30 mb-4 font-mono">
                                        {t("steps.s1Number")}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{t("steps.s1Title")}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("steps.s1Desc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary">
                                    <PhoneCall className="w-4 h-4 mr-1.5" />
                                    Bellen of online aanvragen
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                                <div>
                                    <div className="text-4xl font-black text-primary/30 mb-4 font-mono">
                                        {t("steps.s2Number")}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{t("steps.s2Title")}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("steps.s2Desc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary">
                                    <MapPin className="w-4 h-4 mr-1.5" />
                                    Thuis, kantoor of pechlocatie
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                                <div>
                                    <div className="text-4xl font-black text-primary/30 mb-4 font-mono">
                                        {t("steps.s3Number")}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{t("steps.s3Title")}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("steps.s3Desc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary">
                                    <Wrench className="w-4 h-4 mr-1.5" />
                                    Montage & digitaal balanceren
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                                <div>
                                    <div className="text-4xl font-black text-primary/30 mb-4 font-mono">
                                        {t("steps.s4Number")}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{t("steps.s4Title")}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("steps.s4Desc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary">
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Veilig vertrekken & mobiel betalen
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SERVICES OVERVIEW */}
                <section className="py-20 bg-background border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                {t("servicesTitle")}
                            </h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {t("servicesSubtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv1Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv1Desc")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv2Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv2Desc")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv3Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv3Desc")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv4Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv4Desc")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv5Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv5Desc")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {t("servicesList.srv6Title")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("servicesList.srv6Desc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRANSPARENT PRICING CARDS */}
                <section className="py-20 bg-muted/30 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                {t("pricingTitle")}
                            </h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {t("pricingSubtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {/* Price 1 */}
                            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                                        Locatie Gent
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{t("pricing.calloutTitle")}</h3>
                                    <div className="text-3xl font-black text-foreground mb-4">
                                        {t("pricing.calloutPrice")}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("pricing.calloutDesc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border">
                                    <a href="tel:+32467871205" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                        Vraag voorrijkost aan <ArrowRight className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>

                            {/* Price 2 */}
                            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                                        Pechverhelping
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{t("pricing.punctureTitle")}</h3>
                                    <div className="text-3xl font-black text-foreground mb-4">
                                        {t("pricing.puncturePrice")}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("pricing.punctureDesc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border">
                                    <a href="tel:+32467871205" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                        Direct spoed bellen <ArrowRight className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>

                            {/* Price 3 */}
                            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                                        Zomer / Winter
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{t("pricing.seasonalTitle")}</h3>
                                    <div className="text-3xl font-black text-foreground mb-4">
                                        {t("pricing.seasonalPrice")}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("pricing.seasonalDesc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border">
                                    <Link href="/appointment" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                        Wissel plannen <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Price 4 */}
                            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                                        Banden Kopen
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{t("pricing.newTiresTitle")}</h3>
                                    <div className="text-3xl font-black text-foreground mb-4">
                                        {t("pricing.newTiresPrice")}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("pricing.newTiresDesc")}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border">
                                    <Link href="/tires" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                        Banden bekijken <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COVERAGE AREA / WERKGLEBIED */}
                <section className="py-20 bg-background border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-xl text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                                <MapPin className="w-8 h-8" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">{t("coverageTitle")}</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                                {t("coverageSubtitle")}
                            </p>

                            <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-8">
                                {coverageCities.map((city) => (
                                    <span
                                        key={city}
                                        className="px-4 py-2 rounded-xl text-sm font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border transition-colors cursor-default"
                                    >
                                        📍 {city}
                                    </span>
                                ))}
                            </div>

                            <p className="text-xs md:text-sm text-muted-foreground italic">
                                {t("coverageNotice")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-20 bg-muted/20 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                {t("faqTitle")}
                            </h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {t("faqSubtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q1")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a1")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q2")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a2")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q3")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a3")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q4")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a4")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q5")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a5")}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h3 className="text-base font-bold text-foreground mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{t("faqs.q6")}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {t("faqs.a6")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CALL TO ACTION */}
                <section className="py-20 bg-gradient-to-t from-muted/50 to-background">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <div className="p-10 md:p-14 rounded-3xl border border-primary/30 bg-gradient-to-b from-card to-primary/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                            <h2 className="text-3xl md:text-5xl font-black mb-4">
                                {t("ctaTitle")}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                                {t("ctaDesc")}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="tel:+32467871205"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold shadow-xl shadow-primary/25 text-lg transition-transform hover:-translate-y-0.5"
                                >
                                    <PhoneCall className="w-6 h-6 animate-pulse" />
                                    <span>{t("phone")}</span>
                                </a>

                                <Link
                                    href={{ pathname: "/contact", query: { service: "Mobiele Bandenservice" } }}
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-input bg-card hover:bg-accent text-foreground font-bold shadow-md text-lg transition-transform hover:-translate-y-0.5"
                                >
                                    <span>Online Aanvragen</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                            <p className="mt-6 text-xs text-muted-foreground">
                                Gent Bandenservice B.V. • Dendermondsesteenweg 428, 9040 Sint-Amandsberg
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
